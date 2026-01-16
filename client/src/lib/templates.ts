export interface Template {
  id?: string;
  name: string;
  type: "followup" | "reconnection" | "application" | "interview";
  subject?: string;
  body: string;
  variables: string[];
  is_default?: boolean;
  is_active?: boolean;
}

export const DEFAULT_TEMPLATES: Template[] = [
  {
    name: "Gentle Check-in",
    type: "followup",
    subject: "Following up on {{role}} at {{company}}",
    body: `Hi {{name}},

I wanted to gently check in on the {{role}} position at {{company}}.

I understand how busy you must be, and I know these processes take time. I remain very interested in the opportunity and would be happy to provide any additional information that might be helpful.

Thank you for your time,

{{my_name}}`,
    variables: ["name", "role", "company", "my_name"],
    is_default: true,
  },
  {
    name: "Market Context",
    type: "followup",
    subject: "Re: {{role}} at {{company}}",
    body: `Hi {{name}},

I know the market has been challenging for everyone, and I wanted to check in on the {{role}} role.

No pressure at all - I completely understand if timelines have shifted. Just wanted to express continued interest and see if there's anything I can do to move the process forward.

Best regards,

{{my_name}}`,
    variables: ["name", "role", "company", "my_name"],
    is_default: false,
  },
  {
    name: "Reconnection After Move",
    type: "reconnection",
    subject: "Congratulations on your move to {{new_company}}!",
    body: `Hi {{name}},

Congratulations on your move to {{new_company}}! I saw the news and wanted to reach out.

We connected back in {{month}} regarding {{old_company}}, and I was hoping we could reconnect. I'm currently exploring opportunities and would love to learn more about {{new_company}} and whether there might be a fit for my background in {{my_skills}}.

Would you have 15 minutes for a quick call sometime?

Best,

{{my_name}}`,
    variables: [
      "name",
      "new_company",
      "old_company",
      "month",
      "my_skills",
      "my_name",
    ],
    is_default: false,
  },
  {
    name: "Post-Interview Thank You",
    type: "interview",
    subject: "Thank you - {{role}} at {{company}}",
    body: `Hi {{name}},

Thank you so much for taking the time to meet with me today about the {{role}} role at {{company}}.

I really enjoyed learning more about {{company}} and the team. Our conversation about {{topic_discussed}} resonated with me, and I'm even more excited about the opportunity.

Please don't hesitate to reach out if you need any additional information from me.

Best regards,

{{my_name}}`,
    variables: ["name", "role", "company", "topic_discussed", "my_name"],
    is_default: false,
  },
  {
    name: "Still Interested",
    type: "followup",
    subject: "Still interested in {{role}} at {{company}}",
    body: `Hi {{name}},

I wanted to reach out to confirm that I'm still very interested in the {{role}} position at {{company}}.

I understand these things take time, and I appreciate your patience. If there's anything I can do to move the process forward or provide additional information, please let me know.

Looking forward to hearing from you.

Best,

{{my_name}}`,
    variables: ["name", "role", "company", "my_name"],
    is_default: false,
  },
  {
    name: "Recruiter Initial Outreach",
    type: "application",
    subject: "Re: {{role}} at {{company}} - interested",
    body: `Hi {{name}},

Thank you for reaching out about the {{role}} role at {{company}}. The opportunity sounds very interesting, and I'd love to learn more.

A bit about my background: {{my_background}}

I'm particularly drawn to {{company}} because {{company_interest}}.

Would you have time for a brief call this week to discuss the role?

Best,

{{my_name}}`,
    variables: [
      "name",
      "role",
      "company",
      "my_background",
      "company_interest",
      "my_name",
    ],
    is_default: false,
  },
  {
    name: "Referral Request",
    type: "reconnection",
    subject: "Quick favor - {{role}} at {{company}}",
    body: `Hi {{name}},

I hope you're doing well! I wanted to reach out with a quick favor.

I'm currently exploring opportunities and noticed {{company}} has a {{role}} opening that looks like a great fit for my background in {{my_skills}}.

I know referrals go a long way, and I was wondering if you might be able to recommend me or point me to someone who could. I'm happy to share my resume and more details.

Thanks so much for considering!

Best,

{{my_name}}`,
    variables: ["name", "company", "role", "my_skills", "my_name"],
    is_default: false,
  },
  {
    name: "Salary Negotiation",
    type: "application",
    subject: "Offer discussion - {{role}} at {{company}}",
    body: `Hi {{name}},

Thank you for the offer for the {{role}} position at {{company}}. I'm very excited about the opportunity.

After considering the total compensation package, I'd like to discuss the base salary. Based on my experience and market research for similar roles in {{location}}, I was hoping we could explore a base salary in the range of {{target_salary}}.

I'm very enthusiastic about joining {{company}} and believe this adjustment would help align the offer with market standards.

Would you have time for a call to discuss?

Best regards,

{{my_name}}`,
    variables: [
      "name",
      "role",
      "company",
      "location",
      "target_salary",
      "my_name",
    ],
    is_default: false,
  },
  {
    name: "Offer Deadline",
    type: "application",
    subject: "Deadline for {{role}} offer at {{company}}",
    body: `Hi {{name}},

I wanted to touch base about the timeline for the {{role}} offer. I received the official letter and noticed the response deadline is {{deadline}}.

I'm very excited about the opportunity at {{company}} and want to make sure I provide my decision within the timeframe. However, I'm still waiting to hear back from a couple of other processes that should conclude in the next {{timeline}}.

Is it possible to extend the deadline by {{extension_request}}? I want to ensure I give {{company}} a fully considered answer.

Thank you for your understanding.

Best,

{{my_name}}`,
    variables: [
      "name",
      "role",
      "company",
      "deadline",
      "timeline",
      "extension_request",
      "my_name",
    ],
    is_default: false,
  },
  {
    name: "Rejection Thank You",
    type: "application",
    subject: "Thank you - {{role}} at {{company}}",
    body: `Hi {{name}},

Thank you for letting me know about the decision on the {{role}} position at {{company}}.

Although I'm disappointed, I appreciate the opportunity to learn more about {{company}} and the team. The process was informative, and I have a better understanding of what you're looking for.

I'd love to stay connected for future opportunities that might be a better fit. Please keep me in mind if anything else comes up that aligns with my background in {{my_skills}}.

Thank you again for your time and consideration.

Best regards,

{{my_name}}`,
    variables: ["name", "role", "company", "my_skills", "my_name"],
    is_default: false,
  },
];

export function getTemplateById(id: string): Template | undefined {
  return DEFAULT_TEMPLATES.find((t) => t.id === id);
}

export function getTemplatesByType(type: Template["type"]): Template[] {
  return DEFAULT_TEMPLATES.filter((t) => t.type === type);
}

export function getDefaultTemplates(): Template[] {
  return DEFAULT_TEMPLATES.filter((t) => t.is_default);
}

export function populateTemplate(
  template: Template,
  variables: Record<string, string>,
): string {
  let body = template.body;
  for (const [key, value] of Object.entries(variables)) {
    body = body.replace(new RegExp(`{{${key}}}`, "g"), value);
  }
  return body;
}
