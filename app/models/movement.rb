class Movement < ActiveRestClient::Base
  base_url PUBBLICALO['api_server_url']
  
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
      return ((importo.to_f * 100) / importo_prec.to_f).round(2)
    end
  end

  def perc_su_tot(cumulato_sup)
    return ((importo.to_f * 100) / cumulato_sup.to_f).round(2)
  end

end
