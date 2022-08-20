import { Routes, useParam } from "@blitzjs/next";
import { useMutation, useQuery } from "@blitzjs/rpc";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Suspense } from "react";

import Layout from "app/core/layouts/Layout";
import deleteProject from "app/projects/mutations/deleteProject";
import getProject from "app/projects/queries/getProject";

export const Project = () => {
  const router = useRouter();
  const projectId = useParam("projectId", "number");
  const [deleteProjectMutation] = useMutation(deleteProject);
  const [project] = useQuery(getProject, { id: projectId });

  return (
    <>
      <Head>
        <title>Project {project.id}</title>
      </Head>

      <div>
        <h1>Project {project.id}</h1>
        <pre>{JSON.stringify(project, null, 2)}</pre>

        <Link href={Routes.EditProjectPage({ projectId: project.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteProjectMutation({ id: project.id });
              void router.push(Routes.ProjectsPage());
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  );
};

const ShowProjectPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.ProjectsPage()}>
          <a>Projects</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Project />
      </Suspense>
    </div>
  );
};

ShowProjectPage.authenticate = true;
ShowProjectPage.getLayout = (page) => <Layout>{page}</Layout>;

export default ShowProjectPage;
