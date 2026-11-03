<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Public review submission goes through `submitReview` server fn (honeypot, hashed rate limit, admin client insert as pending); public reads use a publishable-key server client so approved reviews SSR into HTML.
- Review moderation runs from the browser client under RLS (admins only via `has_role`); a DB trigger enforces status-only updates and writes moderated_at/by plus the audit log.
- Cylinder sizes share one browser-safe catalog for display, FAQ-related metadata and structured offers to prevent inconsistent product sizes.
- Desktop navigation uses one persistent measured underline rather than conditional shared-layout elements to avoid disappearing during pointer transitions; the header responds to scroll activity with spring movement and reduced-motion support.
