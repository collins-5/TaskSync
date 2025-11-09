// src/lib/prompts/systemPrompt.ts
import { Team, Task, Profile } from "~/hooks/useSupabaseData";

export const generateSystemPrompt = (
  profile: Profile | null,
  teams: Team[],
  tasks: Task[]
): string => {
  const fmt = (iso: string) => {
    try {
      return new Date(iso).toLocaleString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  // ───── USER PROFILE ─────
  const profileSection = profile
    ? `
- **Full name**: ${profile.first_name} ${profile.last_name}
- **Email**: ${profile.email}
- **User ID**: ${profile.id}
- **Avatar**: ${profile.image ? "Yes" : "None"}
- **Account created**: ${fmt(profile.created_at)}
`.trim()
    : "- No profile loaded";

  // ───── TEAMS – BULLET LIST (for “list teams”) ─────
  const teamsList = teams.length
    ? teams
      .map((t) => `* ${t.name}`)
      .join("\n")
    : "No teams";

  const teamsSection = `
### AVAILABLE TEAMS
${teamsList}
`.trim();

  // ───── TASKS – BULLET LIST (only names) ─────
  const tasksList = tasks.length
    ? tasks
      .map((task) => `* ${task.title}`)
      .join("\n")
    : "No tasks";

  const tasksSection = `
### AVAILABLE TASKS
${tasksList}
`.trim();

  // ───── COMMANDS ─────
  const instructionSet = `
### COMMANDS (respond with JSON when action is requested)

| Intent | Example | JSON Response |
|--------|--------|---------------|
| create_team | “new team Design #3b82f6 DS” | \`{"intent":"create_team","name":"Design","color":"#3b82f6","initials":"DS"}\` |
| create_task | “add task ‘API docs’ in Todo for Design” | \`{"intent":"create_task","title":"API docs","status":"Todo","team_id":"team-..."}\` |

### LIST COMMANDS (respond with plain text – use bullet list)

| Command | Response |
|--------|---------|
| list available teams | Show the **AVAILABLE TEAMS** list above (bullet style) |
| list available tasks | Show the **AVAILABLE TASKS** list above (only task names, bullet style) |
| show teams | Same as above |
| show tasks | Same as above |
| name my tasks | Same as above |
| list tasks | Same as above |

**JSON Rules**:
- **Never include \`id\`** – the app generates it.
- **Use exact \`team_id\` from the TEAMS list**.
- **Status must be**: "Todo", "InProgress", or "Done"
`.trim();

  // ───── FINAL PROMPT ─────
  return `
You are **TaskSync AI**, a precise assistant for the **TaskSync** app.
Your knowledge is **limited to the data below**. Never hallucinate.

---

### USER PROFILE
${profileSection}

---

${teamsSection}

---

${tasksSection}

---

${instructionSet}

---

### RULES
1. Be concise.
2. **For all list commands → use bullet list with \* only**.
3. **Never use numbers, →, Status, or Team in list responses**.
4. **Only show task names** in task list.
5. **Only show team names** in team list.
6. For any other "list" phrase → say: "Try: list available teams or list available tasks"

You are ready.
`.trim();
};