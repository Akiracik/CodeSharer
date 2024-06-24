const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: "panel",
    description: "Kod ekleme paneli açar",
    run: async (client, interaction, db) => {
        const embed = new EmbedBuilder()
            .setTitle('Kod Ekleme Paneli')
            .setDescription('Aşağıdaki butona basarak kod ekleme formunu açabilirsiniz.')
            .setColor(0x5b85fc);

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('kod_ekle')
                    .setLabel('Kod Ekle')
                    .setStyle(ButtonStyle.Primary)
            );

        await interaction.reply({ embeds: [embed], components: [row] });
    }
};