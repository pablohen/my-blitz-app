import { Routes, useParam } from "@blitzjs/next";
import { useMutation, useQuery } from "@blitzjs/rpc";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Suspense } from "react";

import Layout from "app/core/layouts/Layout";
import { FORM_ERROR, ProjectForm } from "app/projects/components/ProjectForm";
import updateProject from "app/projects/mutations/updateProject";
import getProject from "app/projects/queries/getProject";

export const EditProject = () => {
  const router = useRouter();
  const projectId = useParam("projectId", "number");
  const [project, { setQueryData }] = useQuery(
    getProject,
    { id: projectId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  );
  const [updateProjectMutation] = useMutation(updateProject);

  return (
    <>
      <Head>
        <title>Edit Project {project.id}</title>
      </Head>

      <div>
        <h1>Edit Project {project.id}</h1>
        <pre>{JSON.stringify(project, null, 2)}</pre>

        <ProjectForm
          submitText="Update Project"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateProject}
          initialValues={project}
          onSubmit={async (values) => {
            try {
              const updated = await updateProjectMutation({
                id: project.id,
                ...values,
              });
              await setQueryData(updated);
              void router.push(Routes.ShowProjectPage({ projectId: updated.id }));
            } catch (error: any) {
              console.error(error);
              return {
                [FORM_ERROR]: error.toString(),
              };
            }
          }}
        />
      </div>
    </>
  );
};

const EditProjectPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditProject />
      </Suspense>

      <p>
        <Link href={Routes.ProjectsPage()}>
          <a>Projects</a>
        </Link>
      </p>
    </div>
  );
};

EditProjectPage.authenticate = true;
EditProjectPage.getLayout = (page) => <Layout>{page}</Layout>;

export default EditProjectPage;
