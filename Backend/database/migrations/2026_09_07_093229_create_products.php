use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 255);
            $table->text('description')->nullable();
            $table->decimal('prix', 10, 2);
            $table->decimal('prix_remise', 10, 2)->nullable();
            $table->integer('stock');
            $table->unsignedInteger('coop_id');
            $table->unsignedInteger('cat_id');

            $table->foreign('coop_id')->references('id')->on('cooperatives')->onDelete('cascade');
            $table->foreign('cat_id')->references('id')->on('categories')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};