use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_img', function (Blueprint $table) {
            $table->increments('id');
            $table->string('url', 255)->nullable();
            $table->integer('order')->nullable();
            $table->unsignedInteger('product_id')->nullable();

            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_img');
    }
};