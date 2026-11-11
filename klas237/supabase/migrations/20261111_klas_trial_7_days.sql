-- Essai gratuit ramené à 7 jours pour les nouveaux comptes (les accès déjà ouverts ne changent pas).
create or replace function private.activate_klas_signup()
returns trigger language plpgsql security definer set search_path to '' as $$
begin
  if new.email_confirmed_at is not null and new.raw_user_meta_data ->> 'klas_signup' = 'v1'
     and (tg_op = 'INSERT' or old.email_confirmed_at is null) then
    insert into public.ndab_access(owner_id, expires_at, plan_code)
    values (new.id, now() + interval '7 days', 'essai')
    on conflict (owner_id) do nothing;
  end if;
  return new;
end;
$$;
