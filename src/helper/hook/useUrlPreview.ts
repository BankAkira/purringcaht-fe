import { useEffect, useState } from 'react';

type MetaData = {
  success: boolean;
  title: string;
  description: string;
  sitename: string;
  ogUrl: string;
  image: string;
  type: string;
  domain: string;
  favicon: string;
};

export default function useUrlPreview(plainText: string) {
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const urlRegex = /(?:https?:\/\/)?(?:www\.)?\S+\.\S+/g;
        const matches = plainText.match(urlRegex);
        const replacedString = plainText.replace(urlRegex, function (match) {
          return `<a class="underline" href="${match}" target="_blank">${match}</a>`;
        });

        setContent(replacedString);

        if (matches?.[0]) {
          const youtubeUrlRegex =
            /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
          const isYoutube = youtubeUrlRegex.test(matches?.[0]);
          if (!isYoutube) {
            const metaData = await getCommonMetaData(matches?.[0]);
            if (metaData.success) {
              const html = `<a href="${matches?.[0]}" target="_blank" class="flex flex-col overflow-hidden max-w-[250px] rounded-[0.5rem] border border-[#f3f4f6] mt-2"><img src="${metaData.image}" class="h-[100px] object-cover" /><p class="py-1 px-2 border-t border-[#f3f4f6]">${metaData.title}</p></a>`;
              setPreview(html);
            }
          } else {
            const videoId = getYoutubeVideoId(matches?.[0]);
            if (videoId) {
              const html = `
                <div class="flex flex-col overflow-hidden max-w-[250px] rounded-[0.5rem] border border-[#f3f4f6] mt-2">
                  <iframe src='https://www.youtube.com/embed/${videoId}'
                    frameborder='0'
                    width="250px"
                    allow='autoplay; encrypted-media'
                    allowfullscreen
                    title='video'
                  />
                </div>`;
              setPreview(html);
            }
          }
        }
      } catch (error) {
        setPreview('');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getCommonMetaData = async (url: string): Promise<MetaData> => {
    const res = await fetch(`https://getlinkpreview.onrender.com/?url=${url}`);
    const data = await res.json();
    return data;
  };

  function getYoutubeVideoId(url: string) {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11 ? match[2] : null;
  }

  return { loading, data: `${content}${preview}` };
}
