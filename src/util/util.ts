
export async function readJsonBody<T>(response: Response): Promise<T> {
    return await response.json().then(value => value).catch((err) => {
        console.log(`Failed to deserialize JSON body: ${err}`);
    });

};