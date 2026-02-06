import { useMutation, useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type AssessmentFormValues } from "@shared/schema";
import { useLocation } from "wouter";

// Create Assessment Hook
export function useCreateAssessment() {
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (data: AssessmentFormValues) => {
      const res = await fetch(api.assessments.create.path, {
        method: api.assessments.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to submit assessment");
      }
      
      return api.assessments.create.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      // Redirect to results page on success
      setLocation(`/results/${data.id}`);
    },
  });
}

// Get Assessment Hook
export function useAssessment(id: number) {
  return useQuery({
    queryKey: [api.assessments.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.assessments.get.path, { id });
      const res = await fetch(url);
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch assessment results");
      
      return api.assessments.get.responses[200].parse(await res.json());
    },
    enabled: !!id && !isNaN(id),
  });
}
