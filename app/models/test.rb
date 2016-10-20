require 'net/http'
require 'json'

#require 'oauth2'
#client = OAuth2::Client.new('DdSHcF8utZ6j0sAkWxG5CaoOAqIa', 'X9RNpCbUAc8ElHYT6eVnRFRbnJsa', :site => 'https://api.integrazione.lispa.it/oauth2/token')
#client.auth_code.authorize_url(:redirect_uri => 'https://api.integrazione.lispa.it/oauth2/token')
# => "https://example.org/oauth/authorization?response_type=code&client_id=client_id&redirect_uri=http://localhost:8080/oauth2/callback"
#token = client.auth_code.get_token('authorization_code_value', :redirect_uri => 'https://api.integrazione.lispa.it/oauth2/token', :headers => {'Authorization' => 'Basic Wm5VblU5b2g1NnhHMklZRVNfX0dld1R0aUFnYTo3VElBME1ySlRzcUhIVlQ4RnEwTElLOTRET2Nh'})
#response = token.get('/servizi.rl/pubblica.lo/accounts', :params => { 'anno' => '2016' })
#response.class.name

class Token

  def to_params
    {'client_id' => 'DdSHcF8utZ6j0sAkWxG5CaoOAqIa',
     'client_secret' => 'X9RNpCbUAc8ElHYT6eVnRFRbnJsa',
     'grant_type' => 'client_credentials'}
  end

  def request_token
    url = URI("https://api.integrazione.lispa.it/oauth2/token")
    Net::HTTP.post_form(url, self.to_params)
    puts self.params
  end

  def refresh!
    response = request_token
    data = JSON.parse(response.body)
    puts data['access_token']
    puts Time.now + (data['expires_in'].to_i).seconds
  end

  def expired?
    expires_at < Time.now
  end

  def fresh_token
    refresh! if expired?
    access_token
  end
end

t = Token.new
t.request_token
