"use client";
import Image from "next/image";
import LoadingPage from "~/app/loading";
import { api } from "~/trpc/main/react";
import gigachadSmile from "~/../public/images/gigachadSmile.png";
import ProductCard from "./product-card";

export default function Shop() {
    const { data: products, isLoading } = api.product.getAll.useQuery();

    if (isLoading) return <LoadingPage />;

    return (
        <div className="grow container">
            <div className="h-full flex flex-col gap-y-7">
                <div className="space-y-1 text-center">
                    <div className="flex gap-1 justify-center items-center">
                        <Image src={gigachadSmile} className="size-12 rounded-full" alt="gigachad" width={100} height={100} />
                        <h1 className="text-[32px] font-medium">GIGACOINS</h1>
                        <Image src={gigachadSmile} className="size-12 rounded-full" alt="gigachad" width={100} height={100} />
                    </div>
                    <h1 className="text-2xl font-normal text-[#E5E5E5] opacity-60">Тут вы можете купить<br/> больше Gigacoins</h1>
                </div>

                <div className="grow flex flex-col overflow-auto gap-y-2">
                    {products!.map((product) => (
                        <ProductCard product={product} key={product.id} />
                    ))}
                </div>
            </div>
        </div>
    )
}