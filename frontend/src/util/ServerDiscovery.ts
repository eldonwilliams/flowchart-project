import { url } from "../API_URL";

export default function discoverFiles(): Promise<string[]> {
    return new Promise((resolve, reject) => {
        fetch(`${url}/discovery`).then(res => res.json()).then(resolve).catch(reject);
    });
}