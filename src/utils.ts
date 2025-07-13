export const encodedSvg = (svg: string) => svg.replace(/"/g, '%22').replace(/#/g, '%23')
