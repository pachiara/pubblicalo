json.array!(@movements) do |movement|
  json.extract! movement, :id, :anno, :mese, :tipo_conto, :livello, :conto, :voce, :importo
  json.url movement_url(movement, format: :json)
end
