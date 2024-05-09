import { useState, useEffect } from 'react'

import { useRouter } from 'next/router'
import Link from 'next/link'

// 載入指示動畫
import Loader from '@/components/loader'

import { loadProduct } from '@/services/my-product'
import { useLoader } from '@/hooks/use-loader'

// 資料夾的中的`[pid].js`檔案代表這路由中，除了根路由與靜態路由之外的所有路由，例如 `/product/123` 就是這個檔案
// 資料來源:
// https://my-json-server.typicode.com/eyesofkids/json-fake-data/products/${pid}

export default function Detail() {
  // 第1步. 宣告能得到動態路由pid的路由器
  // router.query(物件)，其中包含了pid屬性值
  // router.isReady(布林)，如果是true代表頁面已完成水合作用，可以得到pid
  const router = useRouter()

  const [product, setProduct] = useState({
    id: 0,
    picture: '',
    stock: 0,
    name: '',
    price: 0,
    tags: '',
  })

  // 宣告一個指示是不是正在載入資料的狀態
  // 因為一開始一定是要載入資料，所以預設值為true
  const [isLoading, setIsLoading] = useState(true)

  // 自訂控制開關載入動畫
  // 要手動控制關閉，Context要給參數close={0} `<LoaderProvider close={0}>`
  // showLoader是開載入動畫函式，hideLoader為關動畫函式(手動控制關閉才有用)
  const { showLoader, hideLoader, loading, delay } = useLoader()

  const getProduct = async (pid) => {
    // 開載入動畫函式
    showLoader()

    const data = await loadProduct(pid)
    console.log(data)

    // 設定到狀態中 ===> 進入update階段，觸發重新渲染(re-render) ===> 顯示資料
    // 確定資料是物件資料類型才設定到狀態中(最基本的保護)
    if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
      setProduct(data)
      // 關掉載入動畫，1.5s後
      setTimeout(() => {
        setIsLoading(false)
      }, 1500)
    }
  }

  // 樣式3: didMount+didUpdate
  // 第2步: 在useEffect中監聽router.isReady為true時，才能得到網址上的pid，之後向伺服器要資料
  useEffect(() => {
    console.log(router.query)

    if (router.isReady) {
      const { pid } = router.query
      getProduct(pid)
    }
    // eslint-disable-next-line
  }, [router.isReady])

  return (
    <>
      <h1>商品詳細頁</h1>
      <hr />
      <Link href="/my-product/list">連至 列表頁</Link>
      <br />
      {/* 用isLoading作條件式渲染，決定要呈現載入指示動畫還是內容 */}
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <p>ID: {product.id}</p>
          <p>名稱: {product.name}</p>
          <p>價格: {product.price}</p>
        </>
      )}
    </>
  )
}
