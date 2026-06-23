-- 013 — Editable "Why work with us" homepage bento section.
-- Apply: supabase db execute --file schema/013_why_us.sql
-- Safe to re-run: every column guarded with IF NOT EXISTS.
--
-- The large feature tile (title/text/button/image), the "On market" stat card
-- (label/caption — the number stays bound to the editable stats), and the four
-- feature cards (icon/title/text/image, in whyus_cards). All default to '' / the
-- original copy so existing rows look unchanged. whyus_feature_image falls back
-- to the homepage hero image when blank.

alter table public.site_settings
  add column if not exists whyus_eyebrow        text  not null default '',
  add column if not exists whyus_title          text  not null default '',
  add column if not exists whyus_feature_title  text  not null default '',
  add column if not exists whyus_feature_text   text  not null default '',
  add column if not exists whyus_feature_button text  not null default '',
  add column if not exists whyus_feature_image  text  not null default '',
  add column if not exists whyus_market_label   text  not null default '',
  add column if not exists whyus_market_caption text  not null default '',
  add column if not exists whyus_cards          jsonb not null default
    '[
      {"icon":"map-pin","title":"Block-by-block local","text":"Deep neighborhood knowledge, street by street. Ask us about any block.","image":"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"},
      {"icon":"trending-up","title":"Priced on real data","text":"98.2% of list price, on average. Not guesswork.","image":"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"},
      {"icon":"sparkles","title":"Smart, not pushy","text":"Useful updates when they matter. Silence when they don''t.","image":"https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80"},
      {"icon":"handshake","title":"Concierge, start to close","text":"Staging, photography, paperwork, and negotiation, handled for you.","image":"https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80"}
    ]'::jsonb;
