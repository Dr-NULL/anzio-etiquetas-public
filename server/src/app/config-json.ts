import { json, urlencoded } from 'body-parser';
import helmet from 'helmet';
import { APP } from '.';

export function configJson() {
    APP.use(helmet())

    APP.use(json({
        strict: false,
        type: "application/vnd.api+json",
        limit: "1024mb"
    }))

    APP.use(urlencoded({
        extended: false
    }))
}