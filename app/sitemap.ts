export default function sitemap() {
  const baseUrl = "https://bez-rieltora-git-main-bezrieltors-projects.vercel.app";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/create`,
      lastModified: new Date(),
    },
  ];
}