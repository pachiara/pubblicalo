class MovementsController < ApplicationController
  before_action :set_movement, only: [:show, :edit, :update, :destroy]

  def restore_filter

    if params[:tipo_conto].nil? then
      if !session[:movements_tipo_conto].nil? then
        params[:tipo_conto] = session[:movements_tipo_conto]
      else
        params[:tipo_conto] = "U"
      end
    end

    @last_year = Time.now.year
#    if Movement.find(anno: @last_year, conto: params[:tipo_conto]+".0.00.00.00.000").count == 0 then
#      @last_year = @last_year - 1
#    end

    if params[:anno].nil? then
      if !session[:movements_anno].nil? then
        params[:anno] = session[:movements_anno]
      else
        params[:anno] = @last_year
      end
    end

    if params[:livello].nil? then
      if !session[:movements_livello].nil? then
        params[:livello] = session[:movements_livello]
      else
        params[:livello] = 1
      end
    end

    if params[:ricerca].nil? && !session[:movements_ricerca].nil? then
      params[:ricerca] = session[:movements_ricerca]
    end

    change_order = false
    if params[:sort_column].nil? then
      if !session[:movements_sort_column].nil? then
        params[:sort_column] = session[:movements_sort_column]
      else
        params[:sort_column] = "conto"
      end
    else
      if !session[:movements_sort_column].nil? && session[:movements_sort_column] == params[:sort_column] then
        change_order = true
      end
    end

    if change_order then
      if session[:movements_sort_order] == "ASC" then
        params[:sort_order] = "DESC"
      else
        params[:sort_order] = "ASC"
      end
    end
    if params[:sort_order].nil?
      if !session[:movements_sort_order].nil? then
        params[:sort_order] = session[:movements_sort_order]
      else
        params[:sort_order] = "ASC"
      end
    end

  end

  # GET /movements
  # GET /movements.json
  def index
    restore_filter
    @total = Movement.find(anno: params[:anno], conto: params[:tipo_conto]+".0.00.00.00.000")
    @movements = Movement.find(anno: params[:anno], tipo_conto: params[:tipo_conto], livello: params[:livello],
      ricerca: params[:ricerca], sort_column: params[:sort_column], sort_order: params[:sort_order], per_page: 200)

    session[:movements_anno] = params[:anno]
    session[:movements_tipo_conto] = params[:tipo_conto]
    session[:movements_livello] = params[:livello]
    session[:movements_ricerca] = params[:ricerca]
    session[:movements_sort_column] = params[:sort_column]
    session[:movements_sort_order] = params[:sort_order]
  end

  # GET /movements/1
  # GET /movements/1.json
  def show
    @movements = Movement.find(conto: params[:conto], anno: params[:anno], tipo_conto: params[:tipo_conto], livello: params[:livello],
                                          sort_column: params[:sort_column], sort_order: params[:sort_order])
    @cumulato_sup = params[:importo].to_f
    respond_to do |format|
      format.html
      format.js
    end
  end

  # GET /movements/new
  def new
    @movement = Movement.new
  end

  # GET /movements/1/edit
  def edit
  end

  # POST /movements
  # POST /movements.json
  def create
    @movement = Movement.new(movement_params)

    respond_to do |format|
      if @movement.save
        format.html { redirect_to @movement, notice: 'Movement was successfully created.' }
        format.json { render :show, status: :created, location: @movement }
      else
        format.html { render :new }
        format.json { render json: @movement.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /movements/1
  # PATCH/PUT /movements/1.json
  def update
    respond_to do |format|
      if @movement.update(movement_params)
        format.html { redirect_to @movement, notice: 'Movement was successfully updated.' }
        format.json { render :show, status: :ok, location: @movement }
      else
        format.html { render :edit }
        format.json { render json: @movement.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /movements/1
  # DELETE /movements/1.json
  def destroy
    @movement.destroy
    respond_to do |format|
      format.html { redirect_to movements_url, notice: 'Movement was successfully destroyed.' }
      format.json { head :no_content }
    end
  end


  private
    # Use callbacks to share common setup or constraints between actions.
    def set_movement
      @movement = Movement.find(anno: params[:anno], tipo_conto: params[:tipo_conto], livello: params[:livello])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def movement_params
      params.require(:movement).permit(:anno, :mese, :tipo_conto, :livello, :conto, :voce, :importo)
    end
end
