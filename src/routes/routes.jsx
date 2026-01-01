import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import { Home, Results, QuestionSequence, Menu, CameraFilter } from "../pages/index.js";
const NotFound = lazy(() => import("../pages/NotFound.jsx"));

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
    }
  },
  {
    path: "results",
    Component: Results,
    action: async ({request}) => {
      let formData = await request.formData();
      let v1 = Number(formData.get("weightValue0"));
      let v2 = Number(formData.get("weightValue1"));
      let v3 = Number(formData.get("weightValue2"));
      let v4  =Number(formData.get("weightValue3"));
      let v5 = Number(formData.get("weightValue4"));

      const average = (v1 + v2 + v3 + v4 + v5) / 5;
      console.log("aver: ", average);

      return { selection: Math.floor(average)};
    }
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
    requiresAuth: false,
  }

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
// TODO: is hydrationData working??
], { hydrationData: <>anladen</> });

export default appRoutes;
