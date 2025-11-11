import React, { useEffect, useState } from 'react'
import SelectCampus from './SelectCampus'
import SelectCarrera from './SelectCarrera'
import { campuses as mockCampuses, carreras as mockCarreras } from './mocks'

export default function Onboarding() {
	const [campuses, setCampuses] = useState<Array<{ id: string; name: string }>>([])
	const [carreras, setCarreras] = useState<Array<{ id: string; name: string; campusId: string }>>([])
	const [campusId, setCampusId] = useState<string | null>(null)
	const [carreraId, setCarreraId] = useState<string | null>(null)
	const [loadingCampuses, setLoadingCampuses] = useState(false)
	const [loadingCarreras, setLoadingCarreras] = useState(false)

	useEffect(() => {
		// Simula fetch de campuses
		setLoadingCampuses(true)
		setTimeout(() => {
			setCampuses(mockCampuses)
			setLoadingCampuses(false)
		}, 200)
	}, [])

	useEffect(() => {
		if (!campusId) {
			setCarreras([])
			setCarreraId(null)
			return
		}
		setLoadingCarreras(true)
		setTimeout(() => {
			setCarreras(mockCarreras.filter((c) => c.campusId === campusId))
			setLoadingCarreras(false)
		}, 200)
	}, [campusId])

	function handleSubmit(e?: React.FormEvent) {
		e?.preventDefault()
		// Aquí iría la llamada al backend para guardar la selección
		console.log('Enviar onboarding', { campusId, carreraId })
		alert(`Guardado: campus=${campusId} carrera=${carreraId}`)
	}

	return (
		<div className="max-w-xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-4">Onboarding - Selecciona tu campus y carrera</h1>

			<form onSubmit={handleSubmit}>
				<SelectCampus value={campusId} onChange={setCampusId} options={campuses} loading={loadingCampuses} />

				<SelectCarrera value={carreraId} onChange={setCarreraId} options={carreras.map(c => ({ id: c.id, name: c.name }))} loading={loadingCarreras} disabled={!campusId} />

				<div className="flex items-center justify-end mt-6">
					<button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50" disabled={!campusId || !carreraId}>
						Continuar
					</button>
				</div>
			</form>
		</div>
	)
}
