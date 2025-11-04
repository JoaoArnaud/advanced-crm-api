// src/app/page.tsx
"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100 min-h-screen">
      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-32 pb-24">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
        >
          Gerencie sua empresa de forma inteligente
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10"
        >
          O <span className="font-semibold text-white">CRM Inteligente</span> que automatiza tarefas, centraliza informações e ajuda sua equipe a fechar mais negócios com menos esforço.
        </motion.p>

        <motion.a
          href="/register"
          whileHover={{ scale: 1.05 }}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-8 py-3 rounded-full flex items-center gap-2"
        >
          Experimente Gratuitamente <ArrowRight className="w-5 h-5" />
        </motion.a>

        <p className="mt-4 text-sm text-gray-500">
          Sem cartão de crédito • Teste por 14 dias
        </p>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-24 bg-gray-950/60 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tudo o que você precisa para crescer
          </h2>
          <p className="text-gray-400">
            Um sistema completo e fácil de usar, criado para simplificar o dia a dia da sua equipe.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              title: "Gestão de Clientes",
              desc: "Tenha uma visão 360º dos seus contatos, histórico e interações em um só lugar.",
              icon: "👥",
            },
            {
              title: "Automação de Vendas",
              desc: "Economize tempo com fluxos automáticos que cuidam do trabalho repetitivo.",
              icon: "⚙️",
            },
            {
              title: "Relatórios Inteligentes",
              desc: "Acompanhe o desempenho da equipe e as métricas que realmente importam.",
              icon: "📊",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-left shadow-lg"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="px-6 py-24 bg-gradient-to-r from-cyan-900/20 to-blue-900/10 border-t border-gray-800">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <Image
            src="/crm-dashboard.png"
            width={600}
            height={400}
            alt="CRM Dashboard Preview"
            className="rounded-2xl shadow-lg border border-gray-800"
          />
          <div>
            <h2 className="text-3xl font-bold mb-6">
              Um CRM moderno para empresas modernas
            </h2>
            <ul className="space-y-4 text-gray-300">
              {[
                "Interface intuitiva e responsiva",
                "Integrações com WhatsApp, Email e Google Calendar",
                "Gerenciamento de tarefas e pipeline de vendas",
                "Suporte técnico dedicado 24/7",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="text-cyan-400 w-5 h-5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-6 py-24 text-center bg-gray-950 border-t border-gray-800">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Comece a transformar sua empresa hoje
        </h2>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
          Leve sua gestão para o próximo nível com o CRM que entende suas necessidades.
        </p>
        <a
          href="/register"
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-10 py-4 rounded-full text-lg inline-flex items-center gap-2"
        >
          Criar Conta Agora <ArrowRight className="w-5 h-5" />
        </a>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-gray-500 text-sm border-t border-gray-800">
        © {new Date().getFullYear()} Advanced CRM — Todos os direitos reservados.
      </footer>
    </main>
  );
}
