import { useSearchParams } from "react-router-dom";
import { yt_html } from "../assets/assets";

function YtPreview() {
  const [searchParams] = useSearchParams();
  const thumbnail_url = searchParams.get("thumbnail_url");
  const title = searchParams.get("title");
  console.log(thumbnail_url, title);
  const new_html = yt_html
    .replace("%%THUMBNAIL_URL%%", thumbnail_url!)
    .replace("%%TITLE%%", title!);
  return (
    <div className="fixed inset-0 z-100 bg-black">
      <iframe
        srcDoc={new_html}
        height={"100%"}
        width={"100%"}
        allowFullScreen
      />
    </div>
  );
}

export default YtPreview;
