import { Tab } from "./tab";
import { Tabs } from "./tabs";

export default {
  title: "Complex / Tabs",
};

export const overview = () => (
  <Tabs value={2}>
    <Tab value={1}>1</Tab>
    <Tab value={2}>2</Tab>
    <Tab value={3}>3</Tab>
  </Tabs>
);
