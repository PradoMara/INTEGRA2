import React from 'react'

type Option = { id: string; name: string }

interface SelectCampusProps {
	value: string | null
	onChange: (id: string | null) => void
	options?: Option[]
	loading?: boolean
	error?: string | null
}

export default function SelectCampus({ value, onChange, options = [], loading = false }: SelectCampusProps) {
	return (
		<div className="mb-4">
			<label htmlFor="select-campus" className="block text-sm font-medium text-gray-700 mb-1">Campus</label>
			{loading ? (
				<div className="text-sm text-gray-500">Cargando campuses...</div>
			) : (
				<select
					id="select-campus"
					className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					value={value ?? ''}
					onChange={(e) => onChange(e.target.value || null)}
				>
					<option value="">Selecciona un campus</option>
					{options.map((o) => (
						<option key={o.id} value={o.id}>{o.name}</option>
					))}
				</select>
			)}
		</div>
	)
}
