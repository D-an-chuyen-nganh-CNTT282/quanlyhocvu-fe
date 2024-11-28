import { HttpParams } from "@angular/common/http";

export function convertBlobToBinary(blob: Blob): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            // @ts-ignore: `reader.result` is of type `ArrayBuffer`
            const binaryArray = new Uint8Array(reader.result as ArrayBuffer);
            resolve(binaryArray);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsArrayBuffer(blob); // Read the Blob as ArrayBuffer
    });
}
