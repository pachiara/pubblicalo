class Movement < Flexirest::Base
  @@token = nil
  base_url       PUBBLICALO['base_url']
  before_request :api_authenticate

  get :all,  "/all"
  get :find, "/accounts"

  def idConto
    case livello
    when 1
      return conto.chomp(".00.00.00.000")
    when 2
      return conto.chomp(".00.00.000")
    when 3
      return conto.chomp(".00.000")
    when 4
      return conto.chomp(".000")
    else
      return conto
    end
  end

  def perc_aa_prec
    if importo_prec.nil?
      return nil
    else
      diff = importo.to_f - importo_prec.to_f
#      return ((importo.to_f * 100) / importo_prec.to_f).round(2)
      return ((diff.to_f * 100) / importo_prec.to_f).round(2)
    end
  end

  def perc_su_tot(cumulato_sup)
    return ((importo.to_f * 100) / cumulato_sup.to_f).round(2)
  end

  private

  def api_authenticate (name, request)
    # rinnova token
    # curl -k -d "grant_type=client_credentials" -H "Authorization: Basic UURrSEhQdnoyOTRGM2U4R3JiT0duNjRGbW1jYTo3YmZ6VkNLY25sVlZOcHJCUVZHQXc0aURvOGth" https://api.integrazione.lispa.it/oauth2/token
    # esegue richiesta
    # curl -X GET --header 'Accept: application/json' --header 'Authorization: Bearer efb49d75-fe2d-32e6-9176-951120fd1e53' 'https://api.integrazione.lispa.it/t/servizi.rl/pubblica.lo/1.0/accounts?mandante=130&societa=1000&tipo_conto=E&livello=1&sort_column=conto&sort_order=ASC&page=1&per_page=20'
    return if PUBBLICALO['api_gw'] == "false"
    get_token
    request.headers["Authorization"] = "Bearer "+@@token.token
  end

  def get_token
    site_path      = PUBBLICALO['site_path']
    token_url      = PUBBLICALO['token_url']
    client_id      = PUBBLICALO['client_id']
    client_secret  = PUBBLICALO['client_secret']

    if @@token.nil? || @@token.expired?
      client = OAuth2::Client.new(client_id, client_secret, :site => site_path, :token_url => token_url)
      #code    = client.client_credentials.authorization(client_id, client_secret)
      #@@token = client.get_token(:headers => {'Authorization' => code},
      #                           :content_type => 'application/x-www-form-urlencoded',
      #                           :grant_type => 'client_credentials')
      @@token = client.client_credentials.get_token
    end
  end

end
