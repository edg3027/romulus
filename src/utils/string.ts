export const capitalize = (s: string): string =>
  s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase()

export const toAscii = (str: string) =>
  [...str]
    .map((character) => {
      const charCode = character.codePointAt(0)

      if (!charCode || charCode < 128) {
        return character
      }

      const replacement = mapping.get(charCode)
      return replacement === undefined ? character : replacement
    })
    .join('')

const mapping = new Map([
  [0xc0, 'A'],
  [0xc1, 'A'],
  [0xc2, 'A'],
  [0xc3, 'A'],
  [0xc4, 'A'],
  [0xc5, 'A'],
  [0x1_00, 'A'],
  [0x1_02, 'A'],
  [0x1_04, 'A'],
  [0x1_8f, 'A'],
  [0x1_cd, 'A'],
  [0x1_de, 'A'],
  [0x1_e0, 'A'],
  [0x1_fa, 'A'],
  [0x2_00, 'A'],
  [0x2_02, 'A'],
  [0x2_26, 'A'],
  [0x2_3a, 'A'],
  [0x1d_00, 'A'],
  [0x1e_00, 'A'],
  [0x1e_a0, 'A'],
  [0x1e_a2, 'A'],
  [0x1e_a4, 'A'],
  [0x1e_a6, 'A'],
  [0x1e_a8, 'A'],
  [0x1e_aa, 'A'],
  [0x1e_ac, 'A'],
  [0x1e_ae, 'A'],
  [0x1e_b0, 'A'],
  [0x1e_b2, 'A'],
  [0x1e_b4, 'A'],
  [0x1e_b6, 'A'],
  [0x24_b6, 'A'],
  [0xff_21, 'A'],
  [0xe0, 'a'],
  [0xe1, 'a'],
  [0xe2, 'a'],
  [0xe3, 'a'],
  [0xe4, 'a'],
  [0xe5, 'a'],
  [0x1_01, 'a'],
  [0x1_03, 'a'],
  [0x1_05, 'a'],
  [0x1_ce, 'a'],
  [0x1_df, 'a'],
  [0x1_e1, 'a'],
  [0x1_fb, 'a'],
  [0x2_01, 'a'],
  [0x2_03, 'a'],
  [0x2_27, 'a'],
  [0x2_50, 'a'],
  [0x2_59, 'a'],
  [0x2_5a, 'a'],
  [0x1d_8f, 'a'],
  [0x1d_95, 'a'],
  [0x1e_01, 'a'],
  [0x1e_9a, 'a'],
  [0x1e_a1, 'a'],
  [0x1e_a3, 'a'],
  [0x1e_a5, 'a'],
  [0x1e_a7, 'a'],
  [0x1e_a9, 'a'],
  [0x1e_ab, 'a'],
  [0x1e_ad, 'a'],
  [0x1e_af, 'a'],
  [0x1e_b1, 'a'],
  [0x1e_b3, 'a'],
  [0x1e_b5, 'a'],
  [0x1e_b7, 'a'],
  [0x20_90, 'a'],
  [0x20_94, 'a'],
  [0x24_d0, 'a'],
  [0x2c_65, 'a'],
  [0x2c_6f, 'a'],
  [0xff_41, 'a'],
  [0xa7_32, 'AA'],
  [0xc6, 'AE'],
  [0x1_e2, 'AE'],
  [0x1_fc, 'AE'],
  [0x1d_01, 'AE'],
  [0xa7_34, 'AO'],
  [0xa7_36, 'AU'],
  [0xa7_38, 'AV'],
  [0xa7_3a, 'AV'],
  [0xa7_3c, 'AY'],
  [0x24_9c, '(a)'],
  [0xa7_33, 'aa'],
  [0xe6, 'ae'],
  [0x1_e3, 'ae'],
  [0x1_fd, 'ae'],
  [0x1d_02, 'ae'],
  [0xa7_35, 'ao'],
  [0xa7_37, 'au'],
  [0xa7_39, 'av'],
  [0xa7_3b, 'av'],
  [0xa7_3d, 'ay'],
  [0x1_81, 'B'],
  [0x1_82, 'B'],
  [0x2_43, 'B'],
  [0x2_99, 'B'],
  [0x1d_03, 'B'],
  [0x1e_02, 'B'],
  [0x1e_04, 'B'],
  [0x1e_06, 'B'],
  [0x24_b7, 'B'],
  [0xff_22, 'B'],
  [0x1_80, 'b'],
  [0x1_83, 'b'],
  [0x2_53, 'b'],
  [0x1d_6c, 'b'],
  [0x1d_80, 'b'],
  [0x1e_03, 'b'],
  [0x1e_05, 'b'],
  [0x1e_07, 'b'],
  [0x24_d1, 'b'],
  [0xff_42, 'b'],
  [0x24_9d, '(b)'],
  [0xc7, 'C'],
  [0x1_06, 'C'],
  [0x1_08, 'C'],
  [0x1_0a, 'C'],
  [0x1_0c, 'C'],
  [0x1_87, 'C'],
  [0x2_3b, 'C'],
  [0x2_97, 'C'],
  [0x1d_04, 'C'],
  [0x1e_08, 'C'],
  [0x24_b8, 'C'],
  [0xff_23, 'C'],
  [0xe7, 'c'],
  [0x1_07, 'c'],
  [0x1_09, 'c'],
  [0x1_0b, 'c'],
  [0x1_0d, 'c'],
  [0x1_88, 'c'],
  [0x2_3c, 'c'],
  [0x2_55, 'c'],
  [0x1e_09, 'c'],
  [0x21_84, 'c'],
  [0x24_d2, 'c'],
  [0xa7_3e, 'c'],
  [0xa7_3f, 'c'],
  [0xff_43, 'c'],
  [0x24_9e, '(c)'],
  [0xd0, 'D'],
  [0x1_0e, 'D'],
  [0x1_10, 'D'],
  [0x1_89, 'D'],
  [0x1_8a, 'D'],
  [0x1_8b, 'D'],
  [0x1d_05, 'D'],
  [0x1d_06, 'D'],
  [0x1e_0a, 'D'],
  [0x1e_0c, 'D'],
  [0x1e_0e, 'D'],
  [0x1e_10, 'D'],
  [0x1e_12, 'D'],
  [0x24_b9, 'D'],
  [0xa7_79, 'D'],
  [0xff_24, 'D'],
  [0xf0, 'd'],
  [0x1_0f, 'd'],
  [0x1_11, 'd'],
  [0x1_8c, 'd'],
  [0x2_21, 'd'],
  [0x2_56, 'd'],
  [0x2_57, 'd'],
  [0x1d_6d, 'd'],
  [0x1d_81, 'd'],
  [0x1d_91, 'd'],
  [0x1e_0b, 'd'],
  [0x1e_0d, 'd'],
  [0x1e_0f, 'd'],
  [0x1e_11, 'd'],
  [0x1e_13, 'd'],
  [0x24_d3, 'd'],
  [0xa7_7a, 'd'],
  [0xff_44, 'd'],
  [0x1_c4, 'DZ'],
  [0x1_f1, 'DZ'],
  [0x1_c5, 'Dz'],
  [0x1_f2, 'Dz'],
  [0x24_9f, '(d)'],
  [0x2_38, 'db'],
  [0x1_c6, 'dz'],
  [0x1_f3, 'dz'],
  [0x2_a3, 'dz'],
  [0x2_a5, 'dz'],
  [0xc8, 'E'],
  [0xc9, 'E'],
  [0xca, 'E'],
  [0xcb, 'E'],
  [0x1_12, 'E'],
  [0x1_14, 'E'],
  [0x1_16, 'E'],
  [0x1_18, 'E'],
  [0x1_1a, 'E'],
  [0x1_8e, 'E'],
  [0x1_90, 'E'],
  [0x2_04, 'E'],
  [0x2_06, 'E'],
  [0x2_28, 'E'],
  [0x2_46, 'E'],
  [0x1d_07, 'E'],
  [0x1e_14, 'E'],
  [0x1e_16, 'E'],
  [0x1e_18, 'E'],
  [0x1e_1a, 'E'],
  [0x1e_1c, 'E'],
  [0x1e_b8, 'E'],
  [0x1e_ba, 'E'],
  [0x1e_bc, 'E'],
  [0x1e_be, 'E'],
  [0x1e_c0, 'E'],
  [0x1e_c2, 'E'],
  [0x1e_c4, 'E'],
  [0x1e_c6, 'E'],
  [0x24_ba, 'E'],
  [0x2c_7b, 'E'],
  [0xff_25, 'E'],
  [0xe8, 'e'],
  [0xe9, 'e'],
  [0xea, 'e'],
  [0xeb, 'e'],
  [0x1_13, 'e'],
  [0x1_15, 'e'],
  [0x1_17, 'e'],
  [0x1_19, 'e'],
  [0x1_1b, 'e'],
  [0x1_dd, 'e'],
  [0x2_05, 'e'],
  [0x2_07, 'e'],
  [0x2_29, 'e'],
  [0x2_47, 'e'],
  [0x2_58, 'e'],
  [0x2_5b, 'e'],
  [0x2_5c, 'e'],
  [0x2_5d, 'e'],
  [0x2_5e, 'e'],
  [0x2_9a, 'e'],
  [0x1d_08, 'e'],
  [0x1d_92, 'e'],
  [0x1d_93, 'e'],
  [0x1d_94, 'e'],
  [0x1e_15, 'e'],
  [0x1e_17, 'e'],
  [0x1e_19, 'e'],
  [0x1e_1b, 'e'],
  [0x1e_1d, 'e'],
  [0x1e_b9, 'e'],
  [0x1e_bb, 'e'],
  [0x1e_bd, 'e'],
  [0x1e_bf, 'e'],
  [0x1e_c1, 'e'],
  [0x1e_c3, 'e'],
  [0x1e_c5, 'e'],
  [0x1e_c7, 'e'],
  [0x20_91, 'e'],
  [0x24_d4, 'e'],
  [0x2c_78, 'e'],
  [0xff_45, 'e'],
  [0x24_a0, '(e)'],
  [0x1_91, 'F'],
  [0x1e_1e, 'F'],
  [0x24_bb, 'F'],
  [0xa7_30, 'F'],
  [0xa7_7b, 'F'],
  [0xa7_fb, 'F'],
  [0xff_26, 'F'],
  [0x1_92, 'f'],
  [0x1d_6e, 'f'],
  [0x1d_82, 'f'],
  [0x1e_1f, 'f'],
  [0x1e_9b, 'f'],
  [0x24_d5, 'f'],
  [0xa7_7c, 'f'],
  [0xff_46, 'f'],
  [0x24_a1, '(f)'],
  [0xfb_00, 'ff'],
  [0xfb_03, 'ffi'],
  [0xfb_04, 'ffl'],
  [0xfb_01, 'fi'],
  [0xfb_02, 'fl'],
  [0x1_1c, 'G'],
  [0x1_1e, 'G'],
  [0x1_20, 'G'],
  [0x1_22, 'G'],
  [0x1_93, 'G'],
  [0x1_e4, 'G'],
  [0x1_e5, 'G'],
  [0x1_e6, 'G'],
  [0x1_e7, 'G'],
  [0x1_f4, 'G'],
  [0x2_62, 'G'],
  [0x2_9b, 'G'],
  [0x1e_20, 'G'],
  [0x24_bc, 'G'],
  [0xa7_7d, 'G'],
  [0xa7_7e, 'G'],
  [0xff_27, 'G'],
  [0x1_1d, 'g'],
  [0x1_1f, 'g'],
  [0x1_21, 'g'],
  [0x1_23, 'g'],
  [0x1_f5, 'g'],
  [0x2_60, 'g'],
  [0x2_61, 'g'],
  [0x1d_77, 'g'],
  [0x1d_79, 'g'],
  [0x1d_83, 'g'],
  [0x1e_21, 'g'],
  [0x24_d6, 'g'],
  [0xa7_7f, 'g'],
  [0xff_47, 'g'],
  [0x24_a2, '(g)'],
  [0x1_24, 'H'],
  [0x1_26, 'H'],
  [0x2_1e, 'H'],
  [0x2_9c, 'H'],
  [0x1e_22, 'H'],
  [0x1e_24, 'H'],
  [0x1e_26, 'H'],
  [0x1e_28, 'H'],
  [0x1e_2a, 'H'],
  [0x24_bd, 'H'],
  [0x2c_67, 'H'],
  [0x2c_75, 'H'],
  [0xff_28, 'H'],
  [0x1_25, 'h'],
  [0x1_27, 'h'],
  [0x2_1f, 'h'],
  [0x2_65, 'h'],
  [0x2_66, 'h'],
  [0x2_ae, 'h'],
  [0x2_af, 'h'],
  [0x1e_23, 'h'],
  [0x1e_25, 'h'],
  [0x1e_27, 'h'],
  [0x1e_29, 'h'],
  [0x1e_2b, 'h'],
  [0x1e_96, 'h'],
  [0x24_d7, 'h'],
  [0x2c_68, 'h'],
  [0x2c_76, 'h'],
  [0xff_48, 'h'],
  [0x1_f6, 'HV'],
  [0x24_a3, '(h)'],
  [0x1_95, 'hv'],
  [0xcc, 'I'],
  [0xcd, 'I'],
  [0xce, 'I'],
  [0xcf, 'I'],
  [0x1_28, 'I'],
  [0x1_2a, 'I'],
  [0x1_2c, 'I'],
  [0x1_2e, 'I'],
  [0x1_30, 'I'],
  [0x1_96, 'I'],
  [0x1_97, 'I'],
  [0x1_cf, 'I'],
  [0x2_08, 'I'],
  [0x2_0a, 'I'],
  [0x2_6a, 'I'],
  [0x1d_7b, 'I'],
  [0x1e_2c, 'I'],
  [0x1e_2e, 'I'],
  [0x1e_c8, 'I'],
  [0x1e_ca, 'I'],
  [0x24_be, 'I'],
  [0xa7_fe, 'I'],
  [0xff_29, 'I'],
  [0xec, 'i'],
  [0xed, 'i'],
  [0xee, 'i'],
  [0xef, 'i'],
  [0x1_29, 'i'],
  [0x1_2b, 'i'],
  [0x1_2d, 'i'],
  [0x1_2f, 'i'],
  [0x1_31, 'i'],
  [0x1_d0, 'i'],
  [0x2_09, 'i'],
  [0x2_0b, 'i'],
  [0x2_68, 'i'],
  [0x1d_09, 'i'],
  [0x1d_62, 'i'],
  [0x1d_7c, 'i'],
  [0x1d_96, 'i'],
  [0x1e_2d, 'i'],
  [0x1e_2f, 'i'],
  [0x1e_c9, 'i'],
  [0x1e_cb, 'i'],
  [0x20_71, 'i'],
  [0x24_d8, 'i'],
  [0xff_49, 'i'],
  [0x1_32, 'IJ'],
  [0x24_a4, '(i)'],
  [0x1_33, 'ij'],
  [0x1_34, 'J'],
  [0x2_48, 'J'],
  [0x1d_0a, 'J'],
  [0x24_bf, 'J'],
  [0xff_2a, 'J'],
  [0x1_35, 'j'],
  [0x1_f0, 'j'],
  [0x2_37, 'j'],
  [0x2_49, 'j'],
  [0x2_5f, 'j'],
  [0x2_84, 'j'],
  [0x2_9d, 'j'],
  [0x24_d9, 'j'],
  [0x2c_7c, 'j'],
  [0xff_4a, 'j'],
  [0x24_a5, '(j)'],
  [0x1_36, 'K'],
  [0x1_98, 'K'],
  [0x1_e8, 'K'],
  [0x1d_0b, 'K'],
  [0x1e_30, 'K'],
  [0x1e_32, 'K'],
  [0x1e_34, 'K'],
  [0x24_c0, 'K'],
  [0x2c_69, 'K'],
  [0xa7_40, 'K'],
  [0xa7_42, 'K'],
  [0xa7_44, 'K'],
  [0xff_2b, 'K'],
  [0x1_37, 'k'],
  [0x1_99, 'k'],
  [0x1_e9, 'k'],
  [0x2_9e, 'k'],
  [0x1d_84, 'k'],
  [0x1e_31, 'k'],
  [0x1e_33, 'k'],
  [0x1e_35, 'k'],
  [0x24_da, 'k'],
  [0x2c_6a, 'k'],
  [0xa7_41, 'k'],
  [0xa7_43, 'k'],
  [0xa7_45, 'k'],
  [0xff_4b, 'k'],
  [0x24_a6, '(k)'],
  [0x1_39, 'L'],
  [0x1_3b, 'L'],
  [0x1_3d, 'L'],
  [0x1_3f, 'L'],
  [0x1_41, 'L'],
  [0x2_3d, 'L'],
  [0x2_9f, 'L'],
  [0x1d_0c, 'L'],
  [0x1e_36, 'L'],
  [0x1e_38, 'L'],
  [0x1e_3a, 'L'],
  [0x1e_3c, 'L'],
  [0x24_c1, 'L'],
  [0x2c_60, 'L'],
  [0x2c_62, 'L'],
  [0xa7_46, 'L'],
  [0xa7_48, 'L'],
  [0xa7_80, 'L'],
  [0xff_2c, 'L'],
  [0x1_3a, 'l'],
  [0x1_3c, 'l'],
  [0x1_3e, 'l'],
  [0x1_40, 'l'],
  [0x1_42, 'l'],
  [0x1_9a, 'l'],
  [0x2_34, 'l'],
  [0x2_6b, 'l'],
  [0x2_6c, 'l'],
  [0x2_6d, 'l'],
  [0x1d_85, 'l'],
  [0x1e_37, 'l'],
  [0x1e_39, 'l'],
  [0x1e_3b, 'l'],
  [0x1e_3d, 'l'],
  [0x24_db, 'l'],
  [0x2c_61, 'l'],
  [0xa7_47, 'l'],
  [0xa7_49, 'l'],
  [0xa7_81, 'l'],
  [0xff_4c, 'l'],
  [0x1_c7, 'LJ'],
  [0x1e_fa, 'LL'],
  [0x1_c8, 'Lj'],
  [0x24_a7, '(l)'],
  [0x1_c9, 'lj'],
  [0x1e_fb, 'll'],
  [0x2_aa, 'ls'],
  [0x2_ab, 'lz'],
  [0x1_9c, 'M'],
  [0x1d_0d, 'M'],
  [0x1e_3e, 'M'],
  [0x1e_40, 'M'],
  [0x1e_42, 'M'],
  [0x24_c2, 'M'],
  [0x2c_6e, 'M'],
  [0xa7_fd, 'M'],
  [0xa7_ff, 'M'],
  [0xff_2d, 'M'],
  [0x2_6f, 'm'],
  [0x2_70, 'm'],
  [0x2_71, 'm'],
  [0x1d_6f, 'm'],
  [0x1d_86, 'm'],
  [0x1e_3f, 'm'],
  [0x1e_41, 'm'],
  [0x1e_43, 'm'],
  [0x24_dc, 'm'],
  [0xff_4d, 'm'],
  [0x24_a8, '(m)'],
  [0xd1, 'N'],
  [0x1_43, 'N'],
  [0x1_45, 'N'],
  [0x1_47, 'N'],
  [0x1_4a, 'N'],
  [0x1_9d, 'N'],
  [0x1_f8, 'N'],
  [0x2_20, 'N'],
  [0x2_74, 'N'],
  [0x1d_0e, 'N'],
  [0x1e_44, 'N'],
  [0x1e_46, 'N'],
  [0x1e_48, 'N'],
  [0x1e_4a, 'N'],
  [0x24_c3, 'N'],
  [0xff_2e, 'N'],
  [0xf1, 'n'],
  [0x1_44, 'n'],
  [0x1_46, 'n'],
  [0x1_48, 'n'],
  [0x1_49, 'n'],
  [0x1_4b, 'n'],
  [0x1_9e, 'n'],
  [0x1_f9, 'n'],
  [0x2_35, 'n'],
  [0x2_72, 'n'],
  [0x2_73, 'n'],
  [0x1d_70, 'n'],
  [0x1d_87, 'n'],
  [0x1e_45, 'n'],
  [0x1e_47, 'n'],
  [0x1e_49, 'n'],
  [0x1e_4b, 'n'],
  [0x20_7f, 'n'],
  [0x24_dd, 'n'],
  [0xff_4e, 'n'],
  [0x1_ca, 'NJ'],
  [0x1_cb, 'Nj'],
  [0x24_a9, '(n)'],
  [0x1_cc, 'nj'],
  [0xd2, 'O'],
  [0xd3, 'O'],
  [0xd4, 'O'],
  [0xd5, 'O'],
  [0xd6, 'O'],
  [0xd8, 'O'],
  [0x1_4c, 'O'],
  [0x1_4e, 'O'],
  [0x1_50, 'O'],
  [0x1_86, 'O'],
  [0x1_9f, 'O'],
  [0x1_a0, 'O'],
  [0x1_d1, 'O'],
  [0x1_ea, 'O'],
  [0x1_ec, 'O'],
  [0x1_fe, 'O'],
  [0x2_0c, 'O'],
  [0x2_0e, 'O'],
  [0x2_2a, 'O'],
  [0x2_2c, 'O'],
  [0x2_2e, 'O'],
  [0x2_30, 'O'],
  [0x1d_0f, 'O'],
  [0x1d_10, 'O'],
  [0x1e_4c, 'O'],
  [0x1e_4e, 'O'],
  [0x1e_50, 'O'],
  [0x1e_52, 'O'],
  [0x1e_cc, 'O'],
  [0x1e_ce, 'O'],
  [0x1e_d0, 'O'],
  [0x1e_d2, 'O'],
  [0x1e_d4, 'O'],
  [0x1e_d6, 'O'],
  [0x1e_d8, 'O'],
  [0x1e_da, 'O'],
  [0x1e_dc, 'O'],
  [0x1e_de, 'O'],
  [0x1e_e0, 'O'],
  [0x1e_e2, 'O'],
  [0x24_c4, 'O'],
  [0xa7_4a, 'O'],
  [0xa7_4c, 'O'],
  [0xff_2f, 'O'],
  [0xf2, 'o'],
  [0xf3, 'o'],
  [0xf4, 'o'],
  [0xf5, 'o'],
  [0xf6, 'o'],
  [0xf8, 'o'],
  [0x1_4d, 'o'],
  [0x1_4f, 'o'],
  [0x1_51, 'o'],
  [0x1_a1, 'o'],
  [0x1_d2, 'o'],
  [0x1_eb, 'o'],
  [0x1_ed, 'o'],
  [0x1_ff, 'o'],
  [0x2_0d, 'o'],
  [0x2_0f, 'o'],
  [0x2_2b, 'o'],
  [0x2_2d, 'o'],
  [0x2_2f, 'o'],
  [0x2_31, 'o'],
  [0x2_54, 'o'],
  [0x2_75, 'o'],
  [0x1d_16, 'o'],
  [0x1d_17, 'o'],
  [0x1d_97, 'o'],
  [0x1e_4d, 'o'],
  [0x1e_4f, 'o'],
  [0x1e_51, 'o'],
  [0x1e_53, 'o'],
  [0x1e_cd, 'o'],
  [0x1e_cf, 'o'],
  [0x1e_d1, 'o'],
  [0x1e_d3, 'o'],
  [0x1e_d5, 'o'],
  [0x1e_d7, 'o'],
  [0x1e_d9, 'o'],
  [0x1e_db, 'o'],
  [0x1e_dd, 'o'],
  [0x1e_df, 'o'],
  [0x1e_e1, 'o'],
  [0x1e_e3, 'o'],
  [0x20_92, 'o'],
  [0x24_de, 'o'],
  [0x2c_7a, 'o'],
  [0xa7_4b, 'o'],
  [0xa7_4d, 'o'],
  [0xff_4f, 'o'],
  [0x1_52, 'OE'],
  [0x2_76, 'OE'],
  [0xa7_4e, 'OO'],
  [0x2_22, 'OU'],
  [0x1d_15, 'OU'],
  [0x24_aa, '(o)'],
  [0x1_53, 'oe'],
  [0x1d_14, 'oe'],
  [0xa7_4f, 'oo'],
  [0x2_23, 'ou'],
  [0x1_a4, 'P'],
  [0x1d_18, 'P'],
  [0x1e_54, 'P'],
  [0x1e_56, 'P'],
  [0x24_c5, 'P'],
  [0x2c_63, 'P'],
  [0xa7_50, 'P'],
  [0xa7_52, 'P'],
  [0xa7_54, 'P'],
  [0xff_30, 'P'],
  [0x1_a5, 'p'],
  [0x1d_71, 'p'],
  [0x1d_7d, 'p'],
  [0x1d_88, 'p'],
  [0x1e_55, 'p'],
  [0x1e_57, 'p'],
  [0x24_df, 'p'],
  [0xa7_51, 'p'],
  [0xa7_53, 'p'],
  [0xa7_55, 'p'],
  [0xa7_fc, 'p'],
  [0xff_50, 'p'],
  [0x24_ab, '(p)'],
  [0x2_4a, 'Q'],
  [0x24_c6, 'Q'],
  [0xa7_56, 'Q'],
  [0xa7_58, 'Q'],
  [0xff_31, 'Q'],
  [0x1_38, 'q'],
  [0x2_4b, 'q'],
  [0x2_a0, 'q'],
  [0x24_e0, 'q'],
  [0xa7_57, 'q'],
  [0xa7_59, 'q'],
  [0xff_51, 'q'],
  [0x24_ac, '(q)'],
  [0x2_39, 'qp'],
  [0x1_54, 'R'],
  [0x1_56, 'R'],
  [0x1_58, 'R'],
  [0x2_10, 'R'],
  [0x2_12, 'R'],
  [0x2_4c, 'R'],
  [0x2_80, 'R'],
  [0x2_81, 'R'],
  [0x1d_19, 'R'],
  [0x1d_1a, 'R'],
  [0x1e_58, 'R'],
  [0x1e_5a, 'R'],
  [0x1e_5c, 'R'],
  [0x1e_5e, 'R'],
  [0x24_c7, 'R'],
  [0x2c_64, 'R'],
  [0xa7_5a, 'R'],
  [0xa7_82, 'R'],
  [0xff_32, 'R'],
  [0x1_55, 'r'],
  [0x1_57, 'r'],
  [0x1_59, 'r'],
  [0x2_11, 'r'],
  [0x2_13, 'r'],
  [0x2_4d, 'r'],
  [0x2_7c, 'r'],
  [0x2_7d, 'r'],
  [0x2_7e, 'r'],
  [0x2_7f, 'r'],
  [0x1d_63, 'r'],
  [0x1d_72, 'r'],
  [0x1d_73, 'r'],
  [0x1d_89, 'r'],
  [0x1e_59, 'r'],
  [0x1e_5b, 'r'],
  [0x1e_5d, 'r'],
  [0x1e_5f, 'r'],
  [0x24_e1, 'r'],
  [0xa7_5b, 'r'],
  [0xa7_83, 'r'],
  [0xff_52, 'r'],
  [0x24_ad, '(r)'],
  [0x1_5a, 'S'],
  [0x1_5c, 'S'],
  [0x1_5e, 'S'],
  [0x1_60, 'S'],
  [0x2_18, 'S'],
  [0x1e_60, 'S'],
  [0x1e_62, 'S'],
  [0x1e_64, 'S'],
  [0x1e_66, 'S'],
  [0x1e_68, 'S'],
  [0x24_c8, 'S'],
  [0xa7_31, 'S'],
  [0xa7_85, 'S'],
  [0xff_33, 'S'],
  [0x1_5b, 's'],
  [0x1_5d, 's'],
  [0x1_5f, 's'],
  [0x1_61, 's'],
  [0x1_7f, 's'],
  [0x2_19, 's'],
  [0x2_3f, 's'],
  [0x2_82, 's'],
  [0x1d_74, 's'],
  [0x1d_8a, 's'],
  [0x1e_61, 's'],
  [0x1e_63, 's'],
  [0x1e_65, 's'],
  [0x1e_67, 's'],
  [0x1e_69, 's'],
  [0x1e_9c, 's'],
  [0x1e_9d, 's'],
  [0x24_e2, 's'],
  [0xa7_84, 's'],
  [0xff_53, 's'],
  [0x1e_9e, 'SS'],
  [0x24_ae, '(s)'],
  [0xdf, 'ss'],
  [0xfb_06, 'st'],
  [0x1_62, 'T'],
  [0x1_64, 'T'],
  [0x1_66, 'T'],
  [0x1_ac, 'T'],
  [0x1_ae, 'T'],
  [0x2_1a, 'T'],
  [0x2_3e, 'T'],
  [0x1d_1b, 'T'],
  [0x1e_6a, 'T'],
  [0x1e_6c, 'T'],
  [0x1e_6e, 'T'],
  [0x1e_70, 'T'],
  [0x24_c9, 'T'],
  [0xa7_86, 'T'],
  [0xff_34, 'T'],
  [0x1_63, 't'],
  [0x1_65, 't'],
  [0x1_67, 't'],
  [0x1_ab, 't'],
  [0x1_ad, 't'],
  [0x2_1b, 't'],
  [0x2_36, 't'],
  [0x2_87, 't'],
  [0x2_88, 't'],
  [0x1d_75, 't'],
  [0x1e_6b, 't'],
  [0x1e_6d, 't'],
  [0x1e_6f, 't'],
  [0x1e_71, 't'],
  [0x1e_97, 't'],
  [0x24_e3, 't'],
  [0x2c_66, 't'],
  [0xff_54, 't'],
  [0xde, 'TH'],
  [0xa7_66, 'TH'],
  [0xa7_28, 'TZ'],
  [0x24_af, '(t)'],
  [0x2_a8, 'tc'],
  [0xfe, 'th'],
  [0x1d_7a, 'th'],
  [0xa7_67, 'th'],
  [0x2_a6, 'ts'],
  [0xa7_29, 'tz'],
  [0xd9, 'U'],
  [0xda, 'U'],
  [0xdb, 'U'],
  [0xdc, 'U'],
  [0x1_68, 'U'],
  [0x1_6a, 'U'],
  [0x1_6c, 'U'],
  [0x1_6e, 'U'],
  [0x1_70, 'U'],
  [0x1_72, 'U'],
  [0x1_af, 'U'],
  [0x1_d3, 'U'],
  [0x1_d5, 'U'],
  [0x1_d7, 'U'],
  [0x1_d9, 'U'],
  [0x1_db, 'U'],
  [0x2_14, 'U'],
  [0x2_16, 'U'],
  [0x2_44, 'U'],
  [0x1d_1c, 'U'],
  [0x1d_7e, 'U'],
  [0x1e_72, 'U'],
  [0x1e_74, 'U'],
  [0x1e_76, 'U'],
  [0x1e_78, 'U'],
  [0x1e_7a, 'U'],
  [0x1e_e4, 'U'],
  [0x1e_e6, 'U'],
  [0x1e_e8, 'U'],
  [0x1e_ea, 'U'],
  [0x1e_ec, 'U'],
  [0x1e_ee, 'U'],
  [0x1e_f0, 'U'],
  [0x24_ca, 'U'],
  [0xff_35, 'U'],
  [0xf9, 'u'],
  [0xfa, 'u'],
  [0xfb, 'u'],
  [0xfc, 'u'],
  [0x1_69, 'u'],
  [0x1_6b, 'u'],
  [0x1_6d, 'u'],
  [0x1_6f, 'u'],
  [0x1_71, 'u'],
  [0x1_73, 'u'],
  [0x1_b0, 'u'],
  [0x1_d4, 'u'],
  [0x1_d6, 'u'],
  [0x1_d8, 'u'],
  [0x1_da, 'u'],
  [0x1_dc, 'u'],
  [0x2_15, 'u'],
  [0x2_17, 'u'],
  [0x2_89, 'u'],
  [0x1d_64, 'u'],
  [0x1d_99, 'u'],
  [0x1e_73, 'u'],
  [0x1e_75, 'u'],
  [0x1e_77, 'u'],
  [0x1e_79, 'u'],
  [0x1e_7b, 'u'],
  [0x1e_e5, 'u'],
  [0x1e_e7, 'u'],
  [0x1e_e9, 'u'],
  [0x1e_eb, 'u'],
  [0x1e_ed, 'u'],
  [0x1e_ef, 'u'],
  [0x1e_f1, 'u'],
  [0x24_e4, 'u'],
  [0xff_55, 'u'],
  [0x24_b0, '(u)'],
  [0x1d_6b, 'ue'],
  [0x1_b2, 'V'],
  [0x2_45, 'V'],
  [0x1d_20, 'V'],
  [0x1e_7c, 'V'],
  [0x1e_7e, 'V'],
  [0x1e_fc, 'V'],
  [0x24_cb, 'V'],
  [0xa7_5e, 'V'],
  [0xa7_68, 'V'],
  [0xff_36, 'V'],
  [0x2_8b, 'v'],
  [0x2_8c, 'v'],
  [0x1d_65, 'v'],
  [0x1d_8c, 'v'],
  [0x1e_7d, 'v'],
  [0x1e_7f, 'v'],
  [0x24_e5, 'v'],
  [0x2c_71, 'v'],
  [0x2c_74, 'v'],
  [0xa7_5f, 'v'],
  [0xff_56, 'v'],
  [0xa7_60, 'VY'],
  [0x24_b1, '(v)'],
  [0xa7_61, 'vy'],
  [0x1_74, 'W'],
  [0x1_f7, 'W'],
  [0x1d_21, 'W'],
  [0x1e_80, 'W'],
  [0x1e_82, 'W'],
  [0x1e_84, 'W'],
  [0x1e_86, 'W'],
  [0x1e_88, 'W'],
  [0x24_cc, 'W'],
  [0x2c_72, 'W'],
  [0xff_37, 'W'],
  [0x1_75, 'w'],
  [0x1_bf, 'w'],
  [0x2_8d, 'w'],
  [0x1e_81, 'w'],
  [0x1e_83, 'w'],
  [0x1e_85, 'w'],
  [0x1e_87, 'w'],
  [0x1e_89, 'w'],
  [0x1e_98, 'w'],
  [0x24_e6, 'w'],
  [0x2c_73, 'w'],
  [0xff_57, 'w'],
  [0x24_b2, '(w)'],
  [0x1e_8a, 'X'],
  [0x1e_8c, 'X'],
  [0x24_cd, 'X'],
  [0xff_38, 'X'],
  [0x1d_8d, 'x'],
  [0x1e_8b, 'x'],
  [0x1e_8d, 'x'],
  [0x20_93, 'x'],
  [0x24_e7, 'x'],
  [0xff_58, 'x'],
  [0x24_b3, '(x)'],
  [0xdd, 'Y'],
  [0x1_76, 'Y'],
  [0x1_78, 'Y'],
  [0x1_b3, 'Y'],
  [0x2_32, 'Y'],
  [0x2_4e, 'Y'],
  [0x2_8f, 'Y'],
  [0x1e_8e, 'Y'],
  [0x1e_f2, 'Y'],
  [0x1e_f4, 'Y'],
  [0x1e_f6, 'Y'],
  [0x1e_f8, 'Y'],
  [0x1e_fe, 'Y'],
  [0x24_ce, 'Y'],
  [0xff_39, 'Y'],
  [0xfd, 'y'],
  [0xff, 'y'],
  [0x1_77, 'y'],
  [0x1_b4, 'y'],
  [0x2_33, 'y'],
  [0x2_4f, 'y'],
  [0x2_8e, 'y'],
  [0x1e_8f, 'y'],
  [0x1e_99, 'y'],
  [0x1e_f3, 'y'],
  [0x1e_f5, 'y'],
  [0x1e_f7, 'y'],
  [0x1e_f9, 'y'],
  [0x1e_ff, 'y'],
  [0x24_e8, 'y'],
  [0xff_59, 'y'],
  [0x24_b4, '(y)'],
  [0x1_79, 'Z'],
  [0x1_7b, 'Z'],
  [0x1_7d, 'Z'],
  [0x1_b5, 'Z'],
  [0x2_1c, 'Z'],
  [0x2_24, 'Z'],
  [0x1d_22, 'Z'],
  [0x1e_90, 'Z'],
  [0x1e_92, 'Z'],
  [0x1e_94, 'Z'],
  [0x24_cf, 'Z'],
  [0x2c_6b, 'Z'],
  [0xa7_62, 'Z'],
  [0xff_3a, 'Z'],
  [0x1_7a, 'z'],
  [0x1_7c, 'z'],
  [0x1_7e, 'z'],
  [0x1_b6, 'z'],
  [0x2_1d, 'z'],
  [0x2_25, 'z'],
  [0x2_40, 'z'],
  [0x2_90, 'z'],
  [0x2_91, 'z'],
  [0x1d_76, 'z'],
  [0x1d_8e, 'z'],
  [0x1e_91, 'z'],
  [0x1e_93, 'z'],
  [0x1e_95, 'z'],
  [0x24_e9, 'z'],
  [0x2c_6c, 'z'],
  [0xa7_63, 'z'],
  [0xff_5a, 'z'],
  [0x24_b5, '(z)'],
  [0x20_70, '0'],
  [0x20_80, '0'],
  [0x24_ea, '0'],
  [0x24_ff, '0'],
  [0xff_10, '0'],
  [0xb9, '1'],
  [0x20_81, '1'],
  [0x24_60, '1'],
  [0x24_f5, '1'],
  [0x27_76, '1'],
  [0x27_80, '1'],
  [0x27_8a, '1'],
  [0xff_11, '1'],
  [0x24_88, '1.'],
  [0x24_74, '(1)'],
  [0xb2, '2'],
  [0x20_82, '2'],
  [0x24_61, '2'],
  [0x24_f6, '2'],
  [0x27_77, '2'],
  [0x27_81, '2'],
  [0x27_8b, '2'],
  [0xff_12, '2'],
  [0x24_89, '2.'],
  [0x24_75, '(2)'],
  [0xb3, '3'],
  [0x20_83, '3'],
  [0x24_62, '3'],
  [0x24_f7, '3'],
  [0x27_78, '3'],
  [0x27_82, '3'],
  [0x27_8c, '3'],
  [0xff_13, '3'],
  [0x24_8a, '3.'],
  [0x24_76, '(3)'],
  [0x20_74, '4'],
  [0x20_84, '4'],
  [0x24_63, '4'],
  [0x24_f8, '4'],
  [0x27_79, '4'],
  [0x27_83, '4'],
  [0x27_8d, '4'],
  [0xff_14, '4'],
  [0x24_8b, '4.'],
  [0x24_77, '(4)'],
  [0x20_75, '5'],
  [0x20_85, '5'],
  [0x24_64, '5'],
  [0x24_f9, '5'],
  [0x27_7a, '5'],
  [0x27_84, '5'],
  [0x27_8e, '5'],
  [0xff_15, '5'],
  [0x24_8c, '5.'],
  [0x24_78, '(5)'],
  [0x20_76, '6'],
  [0x20_86, '6'],
  [0x24_65, '6'],
  [0x24_fa, '6'],
  [0x27_7b, '6'],
  [0x27_85, '6'],
  [0x27_8f, '6'],
  [0xff_16, '6'],
  [0x24_8d, '6.'],
  [0x24_79, '(6)'],
  [0x20_77, '7'],
  [0x20_87, '7'],
  [0x24_66, '7'],
  [0x24_fb, '7'],
  [0x27_7c, '7'],
  [0x27_86, '7'],
  [0x27_90, '7'],
  [0xff_17, '7'],
  [0x24_8e, '7.'],
  [0x24_7a, '(7)'],
  [0x20_78, '8'],
  [0x20_88, '8'],
  [0x24_67, '8'],
  [0x24_fc, '8'],
  [0x27_7d, '8'],
  [0x27_87, '8'],
  [0x27_91, '8'],
  [0xff_18, '8'],
  [0x24_8f, '8.'],
  [0x24_7b, '(8)'],
  [0x20_79, '9'],
  [0x20_89, '9'],
  [0x24_68, '9'],
  [0x24_fd, '9'],
  [0x27_7e, '9'],
  [0x27_88, '9'],
  [0x27_92, '9'],
  [0xff_19, '9'],
  [0x24_90, '9.'],
  [0x24_7c, '(9)'],
  [0x24_69, '10'],
  [0x24_fe, '10'],
  [0x27_7f, '10'],
  [0x27_89, '10'],
  [0x27_93, '10'],
  [0x24_91, '10.'],
  [0x24_7d, '(10)'],
  [0x24_6a, '11'],
  [0x24_eb, '11'],
  [0x24_92, '11.'],
  [0x24_7e, '(11)'],
  [0x24_6b, '12'],
  [0x24_ec, '12'],
  [0x24_93, '12.'],
  [0x24_7f, '(12)'],
  [0x24_6c, '13'],
  [0x24_ed, '13'],
  [0x24_94, '13.'],
  [0x24_80, '(13)'],
  [0x24_6d, '14'],
  [0x24_ee, '14'],
  [0x24_95, '14.'],
  [0x24_81, '(14)'],
  [0x24_6e, '15'],
  [0x24_ef, '15'],
  [0x24_96, '15.'],
  [0x24_82, '(15)'],
  [0x24_6f, '16'],
  [0x24_f0, '16'],
  [0x24_97, '16.'],
  [0x24_83, '(16)'],
  [0x24_70, '17'],
  [0x24_f1, '17'],
  [0x24_98, '17.'],
  [0x24_84, '(17)'],
  [0x24_71, '18'],
  [0x24_f2, '18'],
  [0x24_99, '18.'],
  [0x24_85, '(18)'],
  [0x24_72, '19'],
  [0x24_f3, '19'],
  [0x24_9a, '19.'],
  [0x24_86, '(19)'],
  [0x24_73, '20'],
  [0x24_f4, '20'],
  [0x24_9b, '20.'],
  [0x24_87, '(20)'],
  [0xab, '"'],
  [0xbb, '"'],
  [0x20_1c, '"'],
  [0x20_1d, '"'],
  [0x20_1e, '"'],
  [0x20_33, '"'],
  [0x20_36, '"'],
  [0x27_5d, '"'],
  [0x27_5e, '"'],
  [0x27_6e, '"'],
  [0x27_6f, '"'],
  [0xff_02, '"'],
  [0x20_18, "'"],
  [0x20_19, "'"],
  [0x20_1a, "'"],
  [0x20_1b, "'"],
  [0x20_32, "'"],
  [0x20_35, "'"],
  [0x20_39, "'"],
  [0x20_3a, "'"],
  [0x27_5b, "'"],
  [0x27_5c, "'"],
  [0xff_07, "'"],
  [0x20_10, '-'],
  [0x20_11, '-'],
  [0x20_12, '-'],
  [0x20_13, '-'],
  [0x20_14, '-'],
  [0x20_7b, '-'],
  [0x20_8b, '-'],
  [0xff_0d, '-'],
  [0x20_45, '['],
  [0x27_72, '['],
  [0xff_3b, '['],
  [0x20_46, ']'],
  [0x27_73, ']'],
  [0xff_3d, ']'],
  [0x20_7d, '('],
  [0x20_8d, '('],
  [0x27_68, '('],
  [0x27_6a, '('],
  [0xff_08, '('],
  [0x2e_28, '(('],
  [0x20_7e, ')'],
  [0x20_8e, ')'],
  [0x27_69, ')'],
  [0x27_6b, ')'],
  [0xff_09, ')'],
  [0x2e_29, '))'],
  [0x27_6c, '<'],
  [0x27_70, '<'],
  [0xff_1c, '<'],
  [0x27_6d, '>'],
  [0x27_71, '>'],
  [0xff_1e, '>'],
  [0x27_74, '{'],
  [0xff_5b, '{'],
  [0x27_75, '}'],
  [0xff_5d, '}'],
  [0x20_7a, '+'],
  [0x20_8a, '+'],
  [0xff_0b, '+'],
  [0x20_7c, '='],
  [0x20_8c, '='],
  [0xff_1d, '='],
  [0xff_01, '!'],
  [0x20_3c, '!!'],
  [0x20_49, '!?'],
  [0xff_03, '#'],
  [0xff_04, '$'],
  [0x20_52, '%'],
  [0xff_05, '%'],
  [0xff_06, '&'],
  [0x20_4e, '*'],
  [0xff_0a, '*'],
  [0xff_0c, ','],
  [0xff_0e, '.'],
  [0x20_44, '/'],
  [0xff_0f, '/'],
  [0xff_1a, ':'],
  [0x20_4f, ';'],
  [0xff_1b, ';'],
  [0xff_1f, '?'],
  [0x20_47, '??'],
  [0x20_48, '?!'],
  [0xff_20, '@'],
  [0xff_3c, '\\'],
  [0x20_38, '^'],
  [0xff_3e, '^'],
  [0xff_3f, '_'],
  [0x20_53, '~'],
  [0xff_5e, '~'],
])
