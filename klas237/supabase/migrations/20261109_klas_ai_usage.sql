-- Klas 237 · compteur d'usage de l'assistant IA (aucun contenu de question n'est stocké).
-- Table déjà présente sur le projet klas-237 ; réservation atomique : public.klas_ai_take (migration 20261110).
create table if not exists public.klas_ai_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null,
  requests integer not null default 0,
  primary key (user_id, day)
);
alter table public.klas_ai_usage enable row level security;
-- Aucune politique : seul le rôle service (fonction klas-ai) lit et écrit.
revoke all on public.klas_ai_usage from anon, authenticated;
