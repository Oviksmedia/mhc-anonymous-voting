# 🗳️ MHC Anonymous Voting Portal
### Nurses Week 2026 | Maryland Healthcare

A premium, high-trust voting system designed to ensure **one-vote-per-person integrity** while maintaining **100% voter anonymity**. Built for Maryland Healthcare staff to nominate the "Most Hardworking Nurse" with total confidence in the privacy of their ballot.

---

## 🔒 Security & Anonymity Model: "The Blind Box"
The system utilizes a decoupled architecture to prevent any possibility of tracing a vote back to a specific staff member.

1.  **Single-Use Tokens**: Every staff member is issued a unique, 6-digit alphanumeric access code.
2.  **Atomic Transactions**: The system uses a PostgreSQL RPC function (`cast_anonymous_vote`) that marks a token as used and records the vote in a single, non-reversible step.
3.  **Data Decoupling**: There is **no Foreign Key** or logical link between the `votes` table and the `voter_tokens` table. Once a vote is cast, the connection to the access code is severed forever.
4.  **Admin Protection**: The results dashboard is secured with an administrative password, preventing public access to real-time nomination data.

## 🚀 Tech Stack
*   **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion, Lucide React.
*   **Backend**: Supabase (Database, Auth, Edge Functions).
*   **Deployment**: Vercel (Automatic CI/CD via GitHub).
*   **Design**: "Premium Deep Navy" institutional design system.

---

## 🛠️ Setup & Operations

### 1. Database Configuration
Run the following SQL in your Supabase Editor to initialize the security logic:
```sql
-- Creates the atomic voting function
create or replace function cast_anonymous_vote(target_code text, nominee text)
returns json as $$
begin
  if exists (select 1 from voter_tokens where code = target_code and is_used = false) then
    update voter_tokens set is_used = true where code = target_code;
    insert into votes (nominee_name) values (nominee);
    return json_build_object('success', true);
  else
    return json_build_object('success', false, 'message', 'Code invalid or already used');
  end if;
end;
$$ language plpgsql;
```

### 2. Admin Dashboard
The dashboard is accessible at `/results`. 
*   **Admin Password**: `admin-mhc-2026`
*   **Metrics**: Shows total participation (goal: 50 staff), live standings, and sync status.

---

## 📋 Distribution Workflow
1.  **Generate Codes**: Run the `insert_tokens.sql` script in Supabase.
2.  **Export**: Export the `voter_tokens` table as a CSV or text file.
3.  **Distribute**: Send codes to staff via WhatsApp/Email. Each code can only be used once.

---
© 2026 Maryland Healthcare. Institutional Grade Internal Tools.
