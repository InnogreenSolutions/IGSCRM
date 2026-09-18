# Innogreen OS

The first functional foundation for Innogreen's owner dashboard and agent workflow.

## Run locally

```bash
npm install
npm run dev
```

## Current working foundation

- Owner Command Center with My Day, action queue, pipeline, team pulse and right-hand assistant
- Central workboard for customers, leads, tasks, documents, links and team access
- Left-to-right customer pipeline without a qualification stage
- Quote-request checkbox on each customer card
- Closed-won prompt that records the final dollar amount and creates job setup work
- Scheduled-job prompt that creates contractor and equipment-ordering tasks
- Owner Work Hub with priority, daily, scheduled and recurring work
- Reference-only Price Book area with no automatic customer pricing
- Documents and Templates categories for emails, SOPs and program questionnaires
- Useful Links placeholders for EAP, OESP, HRS+, Peterborough, Toronto and Brampton programs
- Quotation Maker launcher for `innogreensolutions.com/quotations`
- Role-ready profiles for TJ, Max, Hassan, Aun and Shanairah
- Field-sales mobile workspaces for Max and Hassan
- Independent sales-partner workspace for Aun with learning, research and coaching tools
- Demo task creation and field voice-memo transcript workflow
- Responsive layout for owner desktop and agent use
- Installable desktop PWA with a standalone app window
- Cockpit and Integrations dock for Gmail, Drive, Calendar, HubSpot, QuickBooks, Financeit, Vista and the Innogreen Assistant

## Security and deployment

- Production builds fail closed to a private sign-in screen.
- Rich dashboard previews are available only from the local development server.
- Demo records contain no real customer names.
- Search engines are instructed not to index or archive the app.
- The service worker never caches `/api/` responses. Authentication and customer data must use server-side authorization and role rules.
- Hostinger can provide HTTPS and a temporary whole-site password gate during onboarding. Individual user permissions still belong in the application authentication layer.

## Desktop installation

After the HTTPS production deployment and security setup, open the app in Chrome or Edge and select **Install Innogreen OS**. The owner dashboard also exposes an **Install app** control when the browser provides the installation prompt.

Browser-local storage currently preserves pipeline movements, quote-request checkboxes, recorded sale amounts and task additions while the secure backend is being connected.

## Verification

```bash
npm test
npm run build
```

## Intentionally not connected yet

Gmail, Google Drive, Sheets, HubSpot, QuickBooks, Financeit and Vista need secure OAuth/server integration. Saving quotations on the live Hostinger site also requires the quotations application and its current database or storage configuration to be inspected before changing production. This foundation uses demo data only so no external records, invoices or customer data are created by accident.
