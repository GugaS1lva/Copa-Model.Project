import { FormEvent, useState } from "react"
import { api } from "../lib/axios"
import Image from "next/image"

import usersAvatarExample from '../assets/users-avatar-example.png'
import mobilePreview from '../assets/mobile-preview.png'
import iconCheck from '../assets/check-icon.svg'
import logo from '../assets/logo.svg'

interface HomeProps {
  poolCount: number
  guessCount: number
  userCount: number
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')

  async function createPool(event: FormEvent) {
    event.preventDefault()

    try {
      const response = await api.post('/pools', {
        title: poolTitle,
      });

      const { code } = response.data

      await navigator.clipboard.writeText(code)

      alert(`Bolão criado com sucesso. O código [ ${code} ] foi copiado para a área de transferência!`)

      setPoolTitle('')
    } catch (err) {
      console.log(err)
      alert('Falha ao criar o bolão, tente novamente!')
    }
  }

  return (
    <div className=" h-screen flex items-center justify-center my-[50px]">
      <main className="text-white max-w-lg mx-4 mr-[110px]">
        <Image
          src={logo}
          alt="Logo do projeto"
          quality={100}
        />

        <h1 className="mt-14 text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExample} alt="" quality={100} />

          <strong className="text-gray-100 text-xl">{/*12.592*/}
            <span className="text-ignite-500">+{props.userCount}</span> pessoas já estão usando!
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            name="text"
            id="text"
            required
            placeholder="Qual é o nome do seu bolão?"
            onChange={event => setPoolTitle(event.target.value)}
            value={poolTitle}
          />

          <button
            className="bg-nlw-500 px-6 py-4 rounded uppercase text-gray-900 font-bold text-sm hover:bg-nlw-600"
            type="submit"
          >Criar meu bolão</button>
        </form>

        <p
          className="mt-4 text-sm text-gray-300 max-w-[400px] leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 divide-x-[1px] divide-gray-600 grid grid-cols-2 text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheck} alt="" quality={100} />

            <div className="flex flex-col"> {/*2.034*/}
              <span className="font-bold text-2xl">+{props.guessCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="flex items-center gap-6 pl-[69px]">
            <Image src={iconCheck} alt="" quality={100} />

            <div className="flex flex-col">{/*192.847*/}
              <span className="font-bold text-2xl">+{props.poolCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <div>
        <Image
          src={mobilePreview}
          alt="Dois celulares exibindo uma prévia da aplicação móvel do projeto"
          quality={100}
        />
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  const [
    guessCountResponse,
    poolCountResponse,
    userCountResponse
  ] = await Promise.all([
    api.get('/pools/count'),
    api.get('/guesses/count'),
    api.get('/users/count'),
  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    }
  }
}
