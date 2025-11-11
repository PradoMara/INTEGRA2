import React from 'react'

type Option = { id: string; name: string }

interface SelectCarreraProps {
	value: string | null
	onChange: (id: string | null) => void
	options?: Option[]
	loading?: boolean
	disabled?: boolean
}

export default function SelectCarrera({ value, onChange, options = [], loading = false, disabled = false }: SelectCarreraProps) {
	return (
		<div className="mb-4">
			<label htmlFor="select-carrera" className="block text-sm font-medium text-gray-700 mb-1">Carrera</label>
			{loading ? (
				<div className="text-sm text-gray-500">Cargando carreras...</div>
			) : (
				<select
					id="select-carrera"
					className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					value={value ?? ''}
					onChange={(e) => onChange(e.target.value || null)}
					disabled={disabled}
				>
					<option value="">Selecciona una carrera</option>
					{options.map((o) => (
						<option key={o.id} value={o.id}>{o.name}</option>
					))}
				</select>
			)}
		</div>
	)
}
