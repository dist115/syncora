import saveAs from 'file-saver'

export const fileDownloader = (url: string, name?: string) => {
    if(!url) return;
    return saveAs(url, name)
}