import { Routes } from "@blitzjs/next";
import { useMutation } from "@blitzjs/rpc";
import Layout from "app/core/layouts/Layout";
import { FORM_ERROR, ProjectForm } from "app/projects/components/ProjectForm";
import createProject from "app/projects/mutations/createProject";
import Link from "next/link";
import { useRouter } from "next/router";

const NewProjectPage = () => {
  const router = useRouter();
  const [createProjectMutation] = useMutation(createProject);

  return (
    <Layout title={"Create New Project"}>
      <h1>Create New Project</h1>

      <ProjectForm
        submitText="Create Project"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateProject}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const project = await createProjectMutation(values);
            void router.push(Routes.ShowProjectPage({ projectId: project.id }));
          } catch (error: any) {
            console.error(error);
            return {
              [FORM_ERROR]: error.toString(),
            };
          }
        }}
      />

      <p>
        <Link href={Routes.ProjectsPage()}>
          <a>Projects</a>
        </Link>
      </p>
    </Layout>
  );
};

NewProjectPage.authenticate = true;

export default NewProjectPage;
