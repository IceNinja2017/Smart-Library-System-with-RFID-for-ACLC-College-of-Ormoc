
import imageCompression from 'browser-image-compression'

export async function compressBookCover(file) {
  const options = {
    maxSizeMB: 0.05, // Target approximately 50 KB
    maxWidthOrHeight: 450,
    useWebWorker: true,
    fileType: 'image/webp',
  }

  const compressedFile = await imageCompression(file, options)

  return new File(
    [compressedFile],
    `${Date.now()}.webp`,
    {
      type: 'image/webp',
    }
  )
}


/** EX NOTES:
    import { supabase } from '../lib/supabase'
    import { compressBookCover } from '../utils/compressBookCover'

    export async function uploadBookCover(file) {
    const compressedFile = await compressBookCover(file)

    const filePath = `covers/${crypto.randomUUID()}.webp`

    const { error } = await supabase.storage
        .from('book-covers')
        .upload(filePath, compressedFile, {
        contentType: 'image/webp',
        upsert: false,
        })

    if (error) {
        throw error
    }

    const { data } = supabase.storage
        .from('book-covers')
        .getPublicUrl(filePath)

    return data.publicUrl
    }
 */