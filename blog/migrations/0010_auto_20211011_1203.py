# Generated by Django 3.0.5 on 2021-10-11 12:03

from django.db import migrations
import mdeditor.fields


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0009_article_modify_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='content',
            field=mdeditor.fields.MDTextField(blank=True, default='', null=True, verbose_name='内容'),
        ),
    ]
