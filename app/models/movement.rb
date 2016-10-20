class Movement < Flexirest::Base
  base_url         PUBBLICALO['base_url']
  before_request :api_authenticate

  get :all, "/all.json"
  get :find_in_batches, "/accounts.json"
#  get :sublevel, "/accounts/"

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
    site_path      = PUBBLICALO['site_path']
    token_url      = PUBBLICALO['token_url']
    client_id      = PUBBLICALO['client_id']
    client_secret  = PUBBLICALO['client_secret']

#    client = OAuth2::Client.new(client_id, client_secret, :site => site_path, :token_url => token_url)
#    code   = client.client_credentials.authorization(client_id, client_secret)
#    token  = client.get_token(:headers => {'Authorization' => code},
#                              :content_type => 'application/x-www-form-urlencoded',
#                              :grant_type => 'client_credentials')
#    response = token.get(request.base_url+request.url, request.get_params)


    api_auth_credentials(client_id, client_secret, digest: "sha256")

    secret_key = ApiAuth.generate_secret_key
    head(:unauthorized) unless ApiAuth.authentic?(request, secret_key)
  end

end
