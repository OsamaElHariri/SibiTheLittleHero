export class JsonDownload {
    // https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
    static download(object: any, jsonName?: string) {
        jsonName = jsonName || `sibi_level_${Math.floor(Math.random() * 1000)}`;
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(object));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${jsonName}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
}