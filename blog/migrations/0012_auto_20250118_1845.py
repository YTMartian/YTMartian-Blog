# Generated by Django 3.0.5 on 2025-01-18 18:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0011_auto_20250118_1813'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tag',
            name='name',
            field=models.CharField(blank=True, default='', max_length=100, unique=True),
        ),
    ]
