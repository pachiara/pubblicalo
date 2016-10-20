require 'oauth2'
require 'base64'

CLIENT_ID     = "DdSHcF8utZ6j0sAkWxG5CaoOAqIa"
CLIENT_SECRET = "X9RNpCbUAc8ElHYT6eVnRFRbnJsa"
#CODE          = "Basic Wm5VblU5b2g1NnhHMklZRVNfX0dld1R0aUFnYTo3VElBME1ySlRzcUhIVlQ4RnEwTElLOTRET2Nh"
site_path     = "https://api.integrazione.lispa.it"
token_url     = "https://api.integrazione.lispa.it/oauth2/token"

client = OAuth2::Client.new(CLIENT_ID, CLIENT_SECRET, :site => site_path, :token_url => token_url)

#puts "=client=start=================="
#puts client.client_credentials.methods
#puts client.client_credentials.authorization(CLIENT_ID, CLIENT_SECRET)
#code = "Basic " + Base64.encode64(CLIENT_ID + ":" + CLIENT_SECRET).delete("\n")
#a = Base64.encode64(CLIENT_ID + ":" + CLIENT_SECRET).delete("\n")
#puts a
#puts Base64.decode64(a)
#puts code
#puts "****"
#puts CODE
#puts "=client=end===================="

code = client.client_credentials.authorization(CLIENT_ID, CLIENT_SECRET)
token = client.get_token(:headers => {'Authorization' => code}, :content_type => 'application/x-www-form-urlencoded', :grant_type => 'client_credentials')

#puts "======================"
#puts "token public_methods:"
#puts token.public_methods
#puts "======================"

puts token.token

begin
  response = token.get('/t/servizi.rl/pubblica.lo/accounts', :params => { 'anno' => '2015' })
rescue OAuth2::Error => e
  puts e
end

#puts response.response.public_methods
puts response.response.status
puts response.response.headers
puts response.response.body
