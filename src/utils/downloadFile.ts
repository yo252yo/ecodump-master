export const openDownloadFileDialog = (filename: string, json: unknown) => {
  // Create blob link to download
  const fileContent = new Blob(
    [decodeURIComponent(encodeURI(JSON.stringify(json)))],
    { type: "application/json;charset=utf-8;" }
  );
  const link = document.createElement("a");
  link.href = URL.createObjectURL(fileContent);
  link.setAttribute("download", `${filename}.json`);
  link.target = "_blank";

  // Append to html link element page
  document.body.appendChild(link);

  // Start download
  link.click();

  // Clean up and remove the link
  link?.parentNode?.removeChild(link);
};
