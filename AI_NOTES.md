# AI Notes

This project was built with help from **Cursor** and **GPT-5** as required.

## Prompts and Key Outputs

### Middleware & Current Organization
- **Prompt**: "How do I implement a `CurrentOrganization` service and `SetCurrentOrganization` middleware that always resolves from session and scopes queries in Laravel?"
- **Accepted**: GPT-5 suggested using a service bound in the container that reads `current_organization_id` from the session, with a fallback to the user’s first organization. This matched the spec and I implemented it.
- **Rejected**: Some outputs suggested using a package like Tenancy, but I rejected it because the spec requires a custom service/trait.

### Contact Controller Optimizations
- **Prompt**: "Optimize my ContactController for meta fields and avatar upload."
- **Accepted**: Centralized `syncMeta` and `handleAvatarUpload` methods from GPT-5’s suggestion. This reduced duplication and improved readability.
- **Rejected**: Suggestions about async image processing (queues) were skipped because out of scope.

### Duplicate Flow
- **Prompt**: "How to enforce exact 422 payload on duplicate contact creation."
- **Accepted**: AI guided me to remove the `unique` validation rule from the FormRequest and move duplicate detection into the controller. This fixed my failing test.
- **Rejected**: Some answers suggested customizing Laravel’s validation response, but I stuck with explicit JSON return in controller for clarity.

### UI (React + Inertia)
- **Prompt**: "Add avatar upload with preview in Create/Edit modal using shadcn/ui + Tailwind."
- **Accepted**: Used GPT-5’s example of `forceFormData: true` and preview via `URL.createObjectURL(file)`. Works cleanly with Laravel file upload.
- **Rejected**: Suggestions involving external component libraries or color styling, since spec requires black-and-white only.

## Reflections
AI tools helped me move faster, especially:
- Structuring the organization scoping pattern
- Cleaning up repetitive controller code
- Debugging the duplicate email test
- Implementing avatar upload with a simple React form pattern

I deliberately rejected suggestions that added complexity (multi-tenancy packages, external UI libraries) to stay aligned with the exact project requirements.
