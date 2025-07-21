"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, AlertTriangle } from "lucide-react"
import { useState } from "react"

export default function ConfigurationGuide() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const envExample = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-aqui

# Supabase Service Role Key (for admin operations)
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui`

  const sqlCommands = `-- 1. Habilitar UUID si aún no lo hiciste
create extension if not exists "uuid-ossp";

-- 2. Tabla principal para las imágenes del cliente
create table imagenes_cliente (
  id uuid primary key default uuid_generate_v4(),
  cliente_id uuid not null,
  seccion text not null,
  item_id integer not null default 1,
  imagen text not null,
  updated_at timestamp with time zone default now()
);

-- 3. Activar RLS
alter table imagenes_cliente enable row level security;

-- 4. Policy para que solo accedan a sus propias imágenes
create policy "solo cliente ve sus imagenes"
on imagenes_cliente
for all
using (auth.uid() = cliente_id)
with check (auth.uid() = cliente_id);

-- 5. Crear bucket para las imágenes
insert into storage.buckets (id, name, public) 
values ('imagenes', 'imagenes', true);

-- 6. Policies para el bucket
create policy "Usuarios pueden subir sus imagenes"
on storage.objects for insert
with check (bucket_id = 'imagenes' and auth.role() = 'authenticated');

create policy "Usuarios pueden ver imagenes publicas"
on storage.objects for select
using (bucket_id = 'imagenes');

create policy "Usuarios pueden actualizar sus imagenes"
on storage.objects for update
using (bucket_id = 'imagenes' and auth.role() = 'authenticated');`

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración de Supabase</h1>
          <p className="text-gray-600">Sigue estos pasos para configurar tu panel de administración</p>
        </div>

        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Error de configuración:</strong> Las variables de entorno de Supabase no están configuradas
            correctamente.
          </AlertDescription>
        </Alert>

        {/* Paso 1: Crear proyecto Supabase */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-teal-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                1
              </span>
              Crear proyecto en Supabase
            </CardTitle>
            <CardDescription>Si aún no tienes un proyecto, créalo primero</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Ir a Supabase Dashboard
              </Button>
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Haz clic en "New Project"</p>
              <p>• Elige un nombre y contraseña para tu base de datos</p>
              <p>• Espera a que se complete la configuración</p>
            </div>
          </CardContent>
        </Card>

        {/* Paso 2: Obtener credenciales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-teal-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                2
              </span>
              Obtener credenciales del proyecto
            </CardTitle>
            <CardDescription>Encuentra tu URL y claves en la configuración</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Ve a tu proyecto en Supabase Dashboard</p>
              <p>• Haz clic en "Settings" → "API"</p>
              <p>• Copia la "Project URL"</p>
              <p>• Copia la "anon public" key</p>
              <p>
                • <strong>Importante:</strong> Copia también la "service_role" key (para crear usuarios)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Paso 3: Configurar variables de entorno */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-teal-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                3
              </span>
              Configurar variables de entorno
            </CardTitle>
            <CardDescription>Crea o actualiza tu archivo .env.local</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg relative">
              <pre className="text-sm overflow-x-auto">{envExample}</pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
                onClick={() => copyToClipboard(envExample, "env")}
              >
                {copied === "env" ? "¡Copiado!" : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                • Crea el archivo <code className="bg-gray-100 px-1 rounded">.env.local</code> en la raíz del proyecto
              </p>
              <p>• Reemplaza los valores con tus credenciales reales de Supabase</p>
              <p>
                • <strong>La SERVICE_ROLE_KEY es necesaria para crear usuarios</strong>
              </p>
              <p>• Reinicia el servidor de desarrollo después de guardar</p>
            </div>
          </CardContent>
        </Card>

        {/* Paso 4: Ejecutar SQL */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-teal-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                4
              </span>
              Ejecutar comandos SQL
            </CardTitle>
            <CardDescription>Configura la base de datos y las políticas de seguridad</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg relative max-h-96 overflow-y-auto">
              <pre className="text-sm">{sqlCommands}</pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
                onClick={() => copyToClipboard(sqlCommands, "sql")}
              >
                {copied === "sql" ? "¡Copiado!" : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Ve a tu proyecto en Supabase Dashboard</p>
              <p>• Haz clic en "SQL Editor"</p>
              <p>• Pega y ejecuta estos comandos uno por uno</p>
            </div>
          </CardContent>
        </Card>

        {/* Paso 5: Reiniciar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-teal-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                5
              </span>
              Reiniciar el servidor
            </CardTitle>
            <CardDescription>Aplica los cambios de configuración</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
              <pre className="text-sm">npm run dev</pre>
            </div>
            <div className="text-sm text-gray-600">
              <p>
                Detén el servidor (Ctrl+C) y vuelve a ejecutar el comando para aplicar las nuevas variables de entorno.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button onClick={() => window.location.reload()} className="bg-teal-600 hover:bg-teal-700">
            Recargar página después de configurar
          </Button>
        </div>
      </div>
    </div>
  )
}
