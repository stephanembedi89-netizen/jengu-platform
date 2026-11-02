const base=Deno.env.get("SUPABASE_URL")!;
const secret=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const cors={"Access-Control-Allow-Origin":"https://klas237.netlify.app","Access-Control-Allow-Headers":"authorization,apikey,content-type","Access-Control-Allow-Methods":"GET,POST,OPTIONS","Vary":"Origin"};
function reply(data:unknown,status=200){return new Response(JSON.stringify(data),{status,headers:{...cors,"Content-Type":"application/json","Cache-Control":"no-store"}})}
async function db(path:string,options:RequestInit={}) {
 const r=await fetch(base+path,{...options,headers:{apikey:secret,Authorization:"Bearer "+secret,"Content-Type":"application/json",Prefer:"return=representation",...options.headers}});
 if(!r.ok)throw new Error("upstream");return r.status===204?null:await r.json();
}
Deno.serve(async(req:Request)=>{
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers:cors});
 if(!["GET","POST"].includes(req.method))return reply({error:"Méthode non autorisée."},405);
 const token=req.headers.get("Authorization");
 if(!token?.startsWith("Bearer "))return reply({error:"Connexion requise."},401);
 try{
  const check=await fetch(base+"/auth/v1/user",{headers:{apikey:secret,Authorization:token}});
  if(!check.ok)return reply({error:"Session expirée. Reconnectez-vous."},401);
  const actor=await check.json();
  if(!actor.id||!actor.email_confirmed_at)return reply({error:"Confirmez votre adresse e-mail."},403);
  const admin=actor.app_metadata?.klas_admin===true;
  let input:any={};
  if(req.method==="POST"){const raw=await req.text();if(raw.length>12000)return reply({error:"Demande trop longue."},413);try{input=JSON.parse(raw)}catch{return reply({error:"Demande invalide."},400)}}
  const url=new URL(req.url), action=req.method==="GET"?url.searchParams.get("action"):input.action;
  if(action==="my_tickets"&&req.method==="GET"){
   const rows=await db("/rest/v1/klas_support_tickets?owner_id=eq."+actor.id+"&select=id,subject,message,status,created_at&order=created_at.desc&limit=50");
   return reply({tickets:rows});
  }
  if(action==="create_ticket"&&req.method==="POST"){
   const subject=typeof input.subject==="string"?input.subject.trim():"",message=typeof input.message==="string"?input.message.trim():"";
   if(subject.length<3||subject.length>120||message.length<10||message.length>3000)return reply({error:"Objet : 3 à 120 caractères. Description : 10 à 3 000 caractères."},400);
   const recent=await db("/rest/v1/klas_support_tickets?owner_id=eq."+actor.id+"&created_at=gte."+encodeURIComponent(new Date(Date.now()-3600000).toISOString())+"&select=id&limit=5");
   if(recent.length>=5)return reply({error:"Vous avez déjà envoyé plusieurs demandes. Réessayez plus tard."},429);
   const rows=await db("/rest/v1/klas_support_tickets",{method:"POST",body:JSON.stringify({owner_id:actor.id,subject,message})});
   return reply({ticket:{id:rows[0].id,status:rows[0].status}},201);
  }
  if(!admin)return reply({error:"Accès réservé à l’administrateur."},403);
  if(action==="users"&&req.method==="GET"){
   const page=Math.max(1,Math.min(10000,Number(url.searchParams.get("page"))||1));
   const result=await db("/auth/v1/admin/users?page="+page+"&per_page=50");
   return reply({users:(result.users||[]).map((u:any)=>({id:u.id,email:u.email,created_at:u.created_at,confirmation_sent_at:u.confirmation_sent_at,email_confirmed_at:u.email_confirmed_at,last_sign_in_at:u.last_sign_in_at})),page});
  }
  if(action==="tickets"&&req.method==="GET"){
   const page=Math.max(1,Math.min(10000,Number(url.searchParams.get("page"))||1));
   return reply({tickets:await db("/rest/v1/klas_support_tickets?select=id,owner_id,subject,message,status,admin_note,created_at&order=created_at.desc&limit=50&offset="+((page-1)*50)),page});
  }
  if(action==="update_ticket"&&req.method==="POST"){
   if(!/^[0-9a-f-]{36}$/i.test(input.id)||!["new","in_progress","resolved"].includes(input.status)||typeof input.note!=="string"||input.note.length>3000)return reply({error:"Demande invalide."},400);
   const rows=await db("/rest/v1/klas_support_tickets?id=eq."+input.id,{method:"PATCH",body:JSON.stringify({status:input.status,admin_note:input.note,updated_at:new Date().toISOString()})});
   return rows.length?reply({ok:true}):reply({error:"Demande introuvable."},404);
  }
  return reply({error:"Action inconnue."},400);
 }catch{return reply({error:"Service indisponible. Réessayez dans quelques instants."},503)}
});
