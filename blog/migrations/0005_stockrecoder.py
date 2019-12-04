# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-02-22 10:59
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0004_limitip_location'),
    ]

    operations = [
        migrations.CreateModel(
            name='StockRecoder',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(default='', max_length=100, verbose_name='标题')),
                ('content', models.TextField(blank=True, default='', null=True, verbose_name='内容')),
                ('time', models.TextField(blank=True, default='', null=True, verbose_name='时间')),
            ],
        ),
    ]