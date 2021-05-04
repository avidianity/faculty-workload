<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        /**
         * @return \Illuminate\Database\Eloquent\Collection
         */
        Collection::macro('toExportable', function () {
            $data = $this->map(function (Model $model) {
                $data = $model->toArray();
                $data['created_at'] = $model->created_at->monthName . ' ' . $model->created_at->day . ', ' . $model->created_at->year;
                $data['updated_at'] = $model->updated_at->monthName . ' ' . $model->updated_at->day . ', ' . $model->updated_at->year;

                return $data;
            });
            return $data;
        });
    }
}
