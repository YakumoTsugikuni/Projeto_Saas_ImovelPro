'use client'

import { useRef, useState } from 'react'
import styles from './ImageUpload.module.css'

interface ImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  kind: 'imovel' | 'avatar'
  max?: number
}

const MAX_SIDE = 1920
const ACCEPT = 'image/jpeg,image/png,image/webp'

/** Reduz fotos grandes (ex: de celular) para no máximo 1920px em WebP antes de enviar. */
async function compress(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/webp', 0.85))
    return blob && blob.size < file.size ? blob : file
  } catch {
    return file
  }
}

export default function ImageUpload({ value, onChange, kind, max = 10 }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(0)
  const [error, setError] = useState('')
  const single = max === 1

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return
    setError('')
    const room = single ? 1 : max - value.length
    const selected = Array.from(files).slice(0, room)
    if (!single && files.length > room) setError(`Máximo de ${max} imagens.`)

    let urls = single ? [] : [...value]
    setUploading(selected.length)
    for (const file of selected) {
      try {
        const body = new FormData()
        body.append('file', await compress(file), file.name)
        body.append('kind', kind)
        const res = await fetch('/api/upload', { method: 'POST', body })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || 'Falha no envio')
        urls = [...urls, data.url]
        onChange(urls)
      } catch (e) {
        setError(`${file.name}: ${(e as Error).message}`)
      }
      setUploading(n => n - 1)
    }
    if (inputRef.current) inputRef.current.value = ''
  }

  const remove = (url: string) => onChange(value.filter(u => u !== url))
  const makeCover = (url: string) => onChange([url, ...value.filter(u => u !== url)])

  return (
    <div className={styles.root}>
      <div className={single ? styles.gridSingle : styles.grid}>
        {value.map((url, i) => (
          <div key={url} className={`${styles.thumb} ${single ? styles.round : ''}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" />
            {!single && i === 0 && <span className={styles.badge}>Capa</span>}
            <div className={styles.actions}>
              {!single && i > 0 && (
                <button type="button" onClick={() => makeCover(url)} title="Usar como capa">★</button>
              )}
              <button type="button" onClick={() => remove(url)} title="Remover">✕</button>
            </div>
          </div>
        ))}

        {(single || value.length < max) && (
          <button
            type="button"
            className={`${styles.add} ${single ? styles.round : ''}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
            disabled={uploading > 0}
          >
            {uploading > 0 ? (
              <span>Enviando{uploading > 1 ? ` (${uploading})` : ''}…</span>
            ) : (
              <>
                <span className={styles.plus}>+</span>
                <span>{single ? (value.length ? 'Trocar foto' : 'Enviar foto') : 'Adicionar fotos'}</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple={!single}
        hidden
        onChange={e => handleFiles(e.target.files)}
      />
      <p className={styles.hint}>JPG, PNG ou WebP. Arraste ou clique para enviar.</p>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
