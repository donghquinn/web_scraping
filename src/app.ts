import "./env";

import { ScrapeObserver } from "libraries/manager.lib";
import { bootstrap } from "server";

const observer = new ScrapeObserver();

observer.start();

await bootstrap();
