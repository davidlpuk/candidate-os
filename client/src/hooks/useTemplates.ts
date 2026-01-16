import { useState, useEffect } from "react";
import {
  supabase,
  type Template,
  TemplateInsert,
  TemplateUpdate,
} from "../lib/supabase";
import { DEFAULT_TEMPLATES } from "../lib/templates";

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setTemplates(DEFAULT_TEMPLATES);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .eq("user_id", user.id)
        .order("usage_count", { ascending: false });

      if (error) throw error;

      const userTemplates = data || [];
      setTemplates([...DEFAULT_TEMPLATES, ...userTemplates]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch templates");
    } finally {
      setLoading(false);
    }
  }

  async function createTemplate(template: TemplateInsert) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("templates")
      .insert({ ...template, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    setTemplates([...templates, data]);
    return data;
  }

  async function updateTemplate(id: string, updates: TemplateUpdate) {
    const { data, error } = await supabase
      .from("templates")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    setTemplates(templates.map((t) => (t.id === id ? data : t)));
    return data;
  }

  async function deleteTemplate(id: string) {
    const { error } = await supabase.from("templates").delete().eq("id", id);

    if (error) throw error;

    if (DEFAULT_TEMPLATES.find((t) => t.id === id)) {
      throw new Error("Cannot delete default templates");
    }

    setTemplates(templates.filter((t) => t.id !== id));
  }

  async function saveDefaultsToDatabase() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    for (const template of DEFAULT_TEMPLATES) {
      const { error } = await supabase.from("templates").insert({
        ...template,
        user_id: user.id,
      });

      if (error) {
        console.error(`Failed to save template ${template.name}:`, error);
      }
    }

    await fetchTemplates();
  }

  return {
    templates,
    loading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    saveDefaultsToDatabase,
    refetch: fetchTemplates,
  };
}
