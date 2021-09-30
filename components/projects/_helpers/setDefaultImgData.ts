import type { ProjectData } from "@/redux/_types/projects/dataTypes";

export type DefaultImgData = { key: string; url: string; };

export const setDefaultProjImgData = (projectData: ProjectData): DefaultImgData[] => {
  const imgData: DefaultImgData[] = []
  if (projectData.images) {
    for (let i = 0; i < 3; i++) {
      if (projectData.images[i]) {
        imgData.push({ key: `${i}_${projectData.images[i]}`, url: projectData.images[i] });
      } else 
        imgData.push({ key: `${i}_programming_stock_${i+1}.jpg`, url: `/images/defaults/programming_stock_${i+1}.jpg` })
    }
  } else {
    for (let i = 0; i < 3; i++) {
      imgData.push({ key: `${i}_programming_stock_${i+1}.jpg`, url: `/images/defaults/programming_stock_${i+1}.jpg` })
    }
  }
  return imgData;
};