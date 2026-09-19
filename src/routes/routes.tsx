import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { Home, Results, QuestionSequence, Menu, CameraFilter } from "../pages";
const NotFound = lazy(() => import("../pages/NotFound"));

/** Shape returned by the `/results` action and read back via `useActionData`. */
export interface ResultsActionData {
  selection: number;
}

const appRoutes = createBrowserRouter([
  {
    path: "/",
    Component: Home,
    index: true,
  },
  {
    path: "quiz",
    Component: QuestionSequence,
    action: async () => {
      console.log("meow");
    },
  },
  {
    path: "results",
    Component: Results,
    action: async ({ request }: ActionFunctionArgs): Promise<ResultsActionData> => {
      const formData = await request.formData();
      const v1 = Number(formData.get("weightValue0"));
      const v2 = Number(formData.get("weightValue1"));
      const v3 = Number(formData.get("weightValue2"));
      const v4 = Number(formData.get("weightValue3"));
      const v5 = Number(formData.get("weightValue4"));

      const average = (v1 + v2 + v3 + v4 + v5) / 5;
      console.log("aver: ", average);

      return { selection: Math.floor(average) };
    },
  },
  {
    path: "menu",
    Component: Menu,
  },
  {
    path: "camera",
    Component: CameraFilter,
  },
  {
    path: "*",
    Component: NotFound,
  },

  //  {
  //    path: "/coffee/:id",
  //    Component: Single,
  //    loader: async ({ params }) => {
  //      const url = `http://localhost:3001/api/coffee/${params.id}`;
  //      try {
  //        let data = await fetch(url);
  //
  //        if (!data.ok) {
  //          throw new Error(`Response status: ${response.status}`);
  //        }
  //        return { data: data.json(), id: params.id, kind: "coffee" }
  //      } catch (err) {
  //        console.log("fetch error: ", err.message);
  //      }
  //      return { id: params.id };
  //    },
  //  },
]);

export default appRoutes;
